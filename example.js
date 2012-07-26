var chiSquare = require('./lib/chi-square.js'),
    crypto = require('crypto'),
    fs = require('fs');

crypto.randomBytes(1024 * 1024, function(err, buffer) {
    if (err) throw err;

    console.log('The chi square distribution over the random data sequence was: %d', chiSquare.calculate(buffer));
});

console.log(chiSquare.calculate(fs.readFileSync('test/fixtures/ascii.txt')));