let data = require('./data');


module.exports = () => {

	let JSDOM = require("jsdom").JSDOM;
	global.document = new JSDOM('<html></html>', {});
	global.window = document.window;
	global.math = require('mathjs');
	global.Algebrite = require('algebrite');
	global.$ = global.jquery = require('jquery');

	global.Equation = require('../src/assets/js/Equation');
	let Calculator = require('../src/assets/js/Calculator'),
		colors = require('colors');

	let $screen = $('<div>'),
		exit = 0,
		c = new Calculator({
        	screen: $screen
    	});

	// Helpers
	let assert = (msg, bool) => {
		if(bool) console.log('- '.gray+msg.green);
		else     console.log('- '.gray+msg.red);
	};
	let log = (msg) => console.log(`- ${msg}`.gray);




	// --------------------------------
	// Test Functionality of Calculator
	// --------------------------------
	console.log('\nfunctionality:');
	c.mode('rad');
	assert('Screen init to 0', c.value() === '0');

	c.add('a');
	log('try invalid character a');
	assert('Screen value is still 0', c.value() === '0');

	log('multiply initial zero');
	c.add('*');
	assert('Screen value is 0*', c.value() === '0*');

	log('add 5 and solve (0*5)');
	c.add('5');
	c.solve();
	assert('Screen value is 0', c.value() === '0');

	c.add('2');
	c.add('^');
	c.add('2');
	log('add 2^2 and solve');
	c.solve();
	assert('Screen value is 4', c.value() === '4');

	log('test clearNext - adding 2 should replace the 4');
	c.add('2');
	assert('Screen value is 2', c.value() === '2');

	c.add('+');
	c.add('2');
	log('add 2 to previous answer');
	c.solve();
	assert('Screen value is 4', c.value() === '4');

	c.add('rt');
	c.add('2');
	log('rt 2 of previous answer');
	c.solve();
	assert('Screen value is 2', c.value() === '2');

	c.add('cos(');
	c.add('P');
	log('add cos(P and solve');
	c.solve();
	assert('Screen value is -1', c.value() === '-1');

	c.mode('deg');
	log('set mode deg');
	c.value('sin(4π)/sin(5π)');
	log('set value to sin(4π)/sin(5π)');
	c.allClear();
	assert('Screen value is cleared', c.value() === '0');





	// --------------------------------
	// Test Equations and Solutions
	// --------------------------------
	console.log('\nequations:');
	let test = (tests) => {
		Object.keys(tests).forEach((i,j) => {
			let o = tests[i],
				log = `${i} == ${o}`;
			c.allClear();
			c.add(i);
			c.solve();
			let val = c.value();

			if(val === o)
				console.log('- '.gray+log.green);

			else if(Math.abs(val - o) < 0.0000000000001){
				console.log('- '.gray+log.yellow.bold);
			}

			else{
				exit++;
				console.log('- '.gray+log.red);
				console.log(val);
			}
		});
	};
	c.mode('rad');
	test(data.get(30, 'rad'));
	c.mode('deg');
	test(data.get(30, 'deg'));
	


    if(exit > 0) process.exit(exit);
};