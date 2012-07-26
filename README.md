Chi-Square
==
Calculates a Chi-square distribution over a sequence of bytes within a Buffer.

The result is a float representing the probability of how frequently a truly random sequence of bytes would exceed the calculated value.

Ideally this float should have a value of 0.5. If so, the given Buffer contained random data.

Read on [Chi-square distribution](http://en.wikipedia.org/wiki/Chi-square_distribution) for more details.

## Installation

```npm install chi-square```

## Examples

```javascript
var chiSquare = require('chi-square'),
    crypto = require('crypto');

crypto.randomBytes(1024 * 1024, function(err, buffer) {
    if (err) throw err;

    console.log('The chi square distribution over the random data sequence was: %d', chiSquare.calculate(buffer));
});
```

The output was:

```
The chi square distribution over the random data sequence was: 0.16175185384825533
```

## License
The library is licensed under MIT.