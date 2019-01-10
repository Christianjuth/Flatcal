let Equation = require('./dist/assets/js/calculator'),
	colors = require('colors'),
	exit = 0;

// required for Equation
global.math = require('mathjs');
global.Algebrite = require('algebrite');







let tests = {

	// basic math
	'5+5':     '10',
	'2+7':     '9',
	'5*5':     '25',
	'5*5*2':   '50',


	// order of operations
	'2+2*4':   '10',
	'(2+2)4':  '16',
	'2^2*4':   '16',


	// exponents and roots
	'4^2':      '16',
	'4rt2':     '2',
	'4rt4rt2':  '2',
	'50^2':     '2500',
	'(4^2)rt2': '4',


	// logs
	'ln(e':       '1',
	'log2(2':     '1',
	'log10(10':   '1',
	'ln(e^10':    '10',
	'log2(2^2':   '2',
	'log10(10^4': '4',



	// TRIG
	// 0 rad
	'sin(0':  '0',
	'cos(0':  '1',
	'tan(0':  '0',
	// P/2 rad
	'sin(P/2':  '1',
	'cos(P/2':  '0',
	// P rad
	'sin(P':  '0',
	'cos(P':  '-1',
	'tan(P':  '0',
	// 3P/2
	'sin(3P/2':  '-1',
	'cos(3/2P':  '0',
	// inverse
	'asin(sin(0': '0',
	'acos(cos(0': '0',
	'atan(tan(0': '0'
};






// run test
Object.keys(tests).forEach(eq => {
	let answer = tests[eq];

	// transform eq
	eq = new Equation(eq);
	let log = `${eq.toString()} == ${answer}`;
	
	if(eq.solve() === answer)
		console.log(log.green);

	else{
		exit = 1;
		console.log(log.red);
	}
});
process.exit(exit);