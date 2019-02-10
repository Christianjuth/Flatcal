let data = require('./data');

// run test
module.exports = () => {
	let Equation = require('../src/assets/js/Equation'),
	colors = require('colors'),
	exit = 0;
	// required for Equation
	global.math = require('mathjs');
	global.Algebrite = require('algebrite');




	// --------------------------------
	// Invalid Equations
	// --------------------------------
	console.log('\ninvalid:');

	let invalid = data.invalid(20);
	invalid.forEach(eq => {
		
		// transform eq
		eq = new Equation(eq);
		let log = eq.toString();
		
		if(!eq.isValid())
			console.log(`- ${log}`.gray);

		else{
			exit++;
			console.log('- '.gray+log.red);
		}
	});


	// --------------------------------
	// Valid Equations
	// --------------------------------
	console.log('\nvalid:');

	let valid = data.valid(20);
	Object.keys(valid).forEach(eq => {
		let answer = valid[eq];

		// transform eq
		eq = new Equation(eq);
		let log = `${eq.toString()} == ${answer}`,
			solution = eq.solve();
		
		if(solution === answer)
			console.log('- '.gray+log.green);

		else if(Math.abs(answer - solution) < 0.000000000000001){
			console.log('- '.gray+log.yellow.bold);
		}

		else{
			exit++;
			console.log('- '.gray+log.red);
			console.log(solution);
		}
	});

	
	if(exit > 0) process.exit(exit);
};