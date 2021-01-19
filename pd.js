
//import { Series, DataFrame } from 'pandas-js';
var Series = require('pandas-js').Series;
var DataFrame = require('pandas-js').DataFrame;

const ds_1 = new Series([1, 2, 3, 4], {name: 'My Data 1'});
console.log('This is a Series');
console.log(ds_1.toString());
console.log(`Sum: ${ds_1.sum()}`);
console.log(`Standard deviation: ${ds_1.std()}`);


const df = new DataFrame([{x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 4}]);

console.log(df)

// Returns [{x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 4}]
console.log(df.to_json({orient: 'records'}));