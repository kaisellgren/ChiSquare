var chiSquare = require('../lib/chi-square.js'),
    fs = require('fs');

module.exports = {
    testDataFileDistribution: function(test) {
        var buffer = fs.readFileSync('fixtures/crypto.randomBytes.data');

        test.ok(chiSquare.calculate(buffer) === 0.16175185384825533, 'The distribution was correct.');
        test.done();
    },

    testAsciiFileDistribution: function(test) {
        var buffer = fs.readFileSync('fixtures/ascii.txt');

        test.ok(chiSquare.calculate(buffer) === 0, 'The distribution should be zero.');
        test.done();
    }
};