// Define pre-calculated values for faster calculation.
const Z_MAX = 6.0; // The maximum value for the normal z.
const LOG_SQRT_PI = 0.5723649429247000870717135; // log(sqrt(π))
const I_SQRT_PI = 0.5641895835477562869480795; // 1/sqrt(π)
const BIG_X = 20.0; // Max value to represent exp(x)

module.exports = {
    /**
     * Calculates a Chi-square distribution over a sequence of bytes within the Buffer.
     * The result is a float representing the probability of how frequently
     * a truly random sequence of bytes would exceed the calculated value.
     *
     * Ideally this float should have a value of 0.5. If so, the given Buffer contained random data.
     *
     * @param {Buffer} buffer
     * @return {Number}
     */
    calculate: function(buffer) {
        var inputSize = buffer.length;

        // Holds an array that represents the count of various characters.
        var charCount = [];

        // Loop through the bytes and increase charCount.
        for (var a = 0; a < inputSize; a++) {
            var temp = buffer.readUInt8(a);

            if (charCount[temp] !== undefined) {
                charCount[temp]++;
            }
            else {
                charCount[temp] = 1;
            }
        }

        // The average number of times a specific character should occur.
        var expectedCount = inputSize / 256;

        var chiSquare = 0;

        for (var i = 0; i < 256; i++) {
            // Ideally this would be close to 0.
            a = (charCount[i] !== undefined ? charCount[i] : 0) - expectedCount;

            chiSquare += (a * a) / expectedCount;
        }

        return calculateChiSquareProbability(parseFloat(chiSquare.toFixed(2)), 255);
    }
};

/**
 * A helper method that returns e^x as long as x >= BIG_X.
 *
 * @param {Number} x
 * @return {Number} float
 */
function calculateExponent(x) {
    return (x < -BIG_X) ? 0.0 : Math.exp(x);
}

/**
 * Calculates the probability for the results of the Chi-square test.
 *
 * @param {Number} x Chi-square value.
 * @param {Number} df Degrees of freedom.
 * @return {Number}
 */
function calculateChiSquareProbability(x, df) {
    if (x <= 0.0 || df < 1)
        return 1.0;

    var a = 0.5 * x;

    if (df > 1)
        var y = calculateExponent(-a);

    var s = 2.0 * calculateNormalZProbability(-Math.sqrt(x));

    if (df > 2) {
        x = 0.5 * (df - 1.0);
        var z = 0.5;

        if (a > BIG_X) {
            var e = LOG_SQRT_PI;
            var c = Math.log(a);

            while (z <= x) {
                e = Math.log(z) + e;
                s += calculateExponent(c * z - a - e);
                z += 1.0;
            }

            return (s);
        }
        else {
            e = I_SQRT_PI / Math.sqrt(a);
            c = 0.0;

            while (z <= x) {
                e = e * (a / z);
                c = c + e;
                z += 1.0;
            }

            return (c * y + s);
        }
    }

    return s;
}

/**
 * Calculates the probability for the normal z.
 *
 * @param {Number} z
 * @return {Number}
 */
function calculateNormalZProbability(z) {
    if (z == 0.0) {
        var x = 0.0;
    }
    else {
        var y = 0.5 * Math.abs(z);

        // Here comes the magic.

        if (y >= Z_MAX * 0.5) {
            x = 1.0;
        }
        else if (y < 1.0) {
            var w = y * y;

            x = 0.000124818987 * w -0.001075204047;
            x *= w +0.005198775019;
            x *= w -0.019198292004;
            x *= w +0.059054035642;
            x *= w -0.151968751364;
            x *= w +0.319152932694;
            x *= w -0.531923007300;
            x *= w +0.797884560593;
            x *= y * 2.0;
        }
        else {
            y -= 2.0;

            x = -0.000045255659 * y +0.000152529290;
            x *= y -0.000019538132;
            x *= y -0.000676904986;
            x *= y +0.001390604284;
            x *= y -0.000794620820;
            x *= y -0.002034254874;
            x *= y +0.006549791214;
            x *= y -0.010557625006;
            x *= y -0.010557625006;
            x *= y +0.011630447319;
            x *= y -0.009279453341;
            x *= y +0.005353579108;
            x *= y -0.002141268741;
            x *= y +0.000535310849;
            x *= y +0.999936657524;
        }
    }

    return z > 0.0 ? (x + 1.0) * 0.5 : (1.0 - x) * 0.5;
}

/**
 * A helper method that turns a character into an integer (i.e. the code-point value of a char).
 *
 * @param {String}
 * @return {Number}
 */
function ord(str) {
    var code = str.charCodeAt(0);

    // High surrogate.
    if (0xD800 <= code && code <= 0xDBFF) {
        // This is just a high surrogate with no following low surrogate, so we return its value;
        if (str.length === 1) {
            return code;
        }

        var low = str.charCodeAt(1);

        return ((code - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }

    // Low surrogate
    if (0xDC00 <= code && code <= 0xDFFF) {
        return code;
    }

    return code;
}