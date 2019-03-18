require('colors');

console.log('Equation.js'.bold.underline);
require('./Equation.js')();

console.log('\nCalculator.js'.bold.underline);
require('./Calculator.js')();

let vg = require('../src/assets/js/global'),
	vm = require('../src/manifest').version,
	vp = require('../package').version;

if(vg !== vm || vm !== vp){
	throw new Error('version mismatch'.red);
}

process.exit(0);