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

	let invalid = data.get(20, 'invalid');
	invalid.forEach(eq => {
		
		// transform eq
		eq = new Equation(eq);
		let log = eq.toString();
		
		if(!eq.isValid()[0])
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

	let test = (tests, mode) => {
		Object.keys(tests).forEach(eq => {
			let answer = tests[eq];

			// transform eq
			eq = new Equation(eq);
			let log = `${eq.toString()} == ${answer}`,
				solution = eq.solve(mode);
			
			if(solution === answer)
				console.log('- '.gray+log.green);

			else if(Math.abs(answer - solution) < 0.0000000000001){
				console.log('- '.gray+log.yellow.bold);
			}

			else{
				exit++;
				console.log('- '.gray+log.red);
				console.log(solution);
			}
		});
	};
	test(data.get(30, 'rad'), 'rad');
	test(data.get(30, 'deg'), 'deg');

	if(exit > 0) process.exit(exit);
};