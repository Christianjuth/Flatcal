const P = Math.PI;
let data = {
	invalid: [
		'5**4',
		'*9',
		'/5',
		'3^^2',
		'10/*3',
		'rt2',
		'1/0',
		'1/sin(0)',
		'1+-5'
	],
	rad: {

		// basic math
		'5+5':     '10',
		'2+7':     '9',
		'5*5':     '25',
		'5*5*2':   '50',


		// order of operations
		'2+2*4':     '10',
		'(2+2)4':    '16',
		'2^2*4':     '16',
		'3+2*4)':    '11',
		'(3+4)(5-2': '21',
		'(3+4)5-2':  '33',


		// exponents and roots
		'4^2':      '16',
		'4rt2':     '2',
		'4rt4rt2':  '2',
		'50^2':     '2500',
		'(4^2)rt2': '4',
		'PP': `${P*P}`,


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
		'asin(sin(0': '0',
		'acos(cos(0': '0',
		'atan(tan(0': '0',
		// P/2 rad
		'sin(P/2':  '1',
		'cos(P/2':  '0',
		'asin(sin(P/2': `${P/2}`,
		'acos(cos(P/2': `${P/2}`,
		'atan(tan(P/2': `${P/2}`,
		// P rad
		'sin(P':  '0',
		'cos(P':  '-1',
		'tan(P':  '0',
		'asin(sin(P': '0',
		'acos(cos(P': `${P}`,
		'atan(tan(P': '0',
		// 3P/2
		'sin(3P/2':  '-1',
		'cos(3/2P':  '0',
		'asin(sin(3P/2': `-${P/2}`,
		'acos(cos(3P/2': `${P/2}`,
		'atan(tan(3P/2': `${P/2}`,
		// 2P
		'sin(2P':  '0',
		'cos(2P':  '1',
		'tan(2P':  '0',
		'asin(sin(2P': '0',
		'acos(cos(2P': '0',
		'atan(tan(2P': '0'
	},
	deg: {
		// TRIG
		// 0 rad
		'sin(0':  '0',
		'cos(0':  '1',
		'tan(0':  '0',
		'asin(sin(0': '0',
		'acos(cos(0': '0',
		'atan(tan(0': '0',
		// P/2 rad
		'sin(90':  '1',
		'sin(45+45)':  '1',
		'sin(45*2)':  '1',
		'cos(90':  '0',
		'cos(45+45':  '0',
		'asin(sin(90': '90',
		'acos(cos(90': '90',
		'atan(tan(90': '90',
		// P rad
		'sin(180':  '0',
		'cos(180':  '-1',
		'tan(180':  '0',
		'asin(sin(180': '0',
		'acos(cos(180': '180',
		'atan(tan(180': '0',
		// 3P/2
		'sin(270':  '-1',
		'cos(270':  '0',
		'asin(sin(270': '-90',
		'acos(cos(270': '90',
		'atan(tan(270': '90',
		// 2P
		'sin(360':  '0',
		'cos(360':  '1',
		'tan(360':  '0',
		'asin(sin(360': '0',
		'acos(cos(360': '0',
		'atan(tan(360': '0',
		// 3P
		'cos(6*45':  '0',



		// multi level
		'cos(sin(90+90':  '1',
		'sin(cos(180-90':  '0',
		'sin(cos(180)+1':  '0',
		'cos(6^2*10':  '1',
		'sin(cos(6^2*10)-1':  '0',
		'sin(45*2':  '1',
		'sin(45+90/2':  '1'
	}
};




let select = (n, data) => {
	let shuffle = (a) => {
	    for (let i = a.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [a[i], a[j]] = [a[j], a[i]];
	    }
	    return a;
	};

	let out;
	if(data.constructor == Array)
		out = shuffle(data);

	else{
		let keys = shuffle(Object.keys(data));
		out = {};
		keys.slice(n * -1).forEach(key => {
			out[key] = data[key];
		});
	}

	return out;
};


module.exports = {
	invalid: (n) => {
		return select(n, data.invalid);
	},
	valid: (n) => {
		return select(n, data.valid);
	},
	get: (n, key) => {
		return select(n, data[key]);
	}
};