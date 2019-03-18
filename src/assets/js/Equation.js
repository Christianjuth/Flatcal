class Equation {

    constructor(equation) {
        this.equation = equation;
        this.beautify();
        return this;
    }

    beautify() {
        let eq = this.equation,
            opens = (eq.match(/\(/g) || []).length,
            closes = (eq.match(/\)/g) || []).length;

        // math parentheses
        if(opens > closes) eq += ')'.repeat(opens - closes);
        else eq = '( '.repeat(closes - opens) + eq;

        // remove extra parentheses at start/end
        if(/^\(+[^(]*\)+$/.test(eq) && /^\(+[^)]*\)+$/.test(eq))
            eq = eq.replace(/(^\(|\)$)/g,'');

        // remove * next to ( )
        // eq 4*(3+3) --> 4(3+3)
        eq = eq.replace(/(\)\*)/g,')').replace(/(\*\()/g,'(');

        // remove unneeded decimals
        // eq = eq.replace(/\.([\D])/,'$1');

        return this.equation = eq;
    }

    toString() {
        return this.equation;
    }

    solveForFrac(eq) {

        let middle = eq.split('/');
        eq = middle.shift();
        middle = middle.join('/');

        let end = '',
            openIndex = 0,
            closeIndex = 0;


        let finished = false,
            typeOfLast = '';

        middle.split('').forEach((char, i) => {
            let type;
            if(/([a-z])/i.test(char))
                type = 'letter';
            else if(/([0-9])/i.test(char))
                type = 'number';
            else
                type = 'other';

            // finished acts as a break
            let isFunction = (typeOfLast == 'letter' && char == '('),
                diffFromLast = (typeOfLast != 'skip' && type != typeOfLast),
                leadingOp = (i == 0 && /(\+|-)/.test(char)),
                higherOrder = char == '^';

            if(!finished && !leadingOp && i > 0 && diffFromLast && !isFunction && closeIndex == openIndex && !higherOrder){
                finished = true;

                end = middle.substr(i);
                middle = middle.substr(0, i);
            }

            if(char == ')') closeIndex++;
            if(char == '(') openIndex++;

            // skip first operator
            // ex 4/-4 the -4 is
            // treated as part of the 4
            if(leadingOp)
                typeOfLast = 'skip';
            // reset if higher order
            // of operation ex 4/e^2
            else if(higherOrder)
                typeOfLast = 'skip';
            else if(/([a-z])/i.test(char))
                typeOfLast = 'letter';
            else if(/([0-9])/i.test(char))
                typeOfLast = 'number';
            else
                type = 'other';
        });

        if(middle.indexOf('/') !== -1) middle = this.solveForFrac(middle);
        if(end && end.indexOf('/') !== -1) end = this.solveForFrac(end);
        let out = `${eq}/(${middle})${end}`;

        return out;
    }

    preSolve(mode = 'rad', exact = true) {
        let value = this.equation.replace(/\s*/g,'');

        // operators
        let ops = {
            '%': '(0.01)',
            'ln': 'log',
            '\u00F7': '/',
            '\u00D7': '*',

            // fix op followed by
            // negative number error
            // This is an Algebrite issue 
            '\\*-': '*(-1)',
            '\\+-': '-',
            '--': '+',
            '\u221A': 'sqrt'
        };
        Object.keys(ops).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `${ops[str]}`);
        });

        if(value.indexOf('/') !== -1)
            value = this.solveForFrac(value, false);

        // vars
        let algebriteVars = {
            'P': 'pi',
            '\u03C0': 'pi',
            'T': '2pi',
            '\u03C4': '2pi'
        };
        Object.keys(algebriteVars).forEach(str => {
            let insert = algebriteVars[str]; 
            insert = /^\s*\(.*\)\s*$/.test(insert) ? insert : `(${insert})`;
            value = value.replace(new RegExp(str, 'g'), insert);
        });

        let solveMode = (eq) => {
            return eq.replace(/([^a]|^)((sin|cos|tan)\(.+)/g, function(x, a, val) {
                let split = val.split('(');
                let trig = split.shift();
                val = '('+split.join('(');

                let middle = val;

                let end = '',
                    openIndex = 0,
                    closeIndex = 0;


                let finished = false;
                middle.split('').forEach((char, i) => {
                    if(char == '(') openIndex++;
                    if(char == ')') closeIndex++;

                    if((i > 0 || char != ' ') && !finished && closeIndex == openIndex){
                        finished = true;

                        end = middle.substr(i+1);
                        middle = middle.substr(0, i+1);
                    }
                });

                let degToRad = mode == 'deg' ? '(pi/180)*' : '';
                let out = trig+'('+degToRad+middle+')'+end;
                if(/sin|cos|tan/.test('('+degToRad+middle+')'+end)){
                    return a+trig+'('+solveMode(degToRad+middle+')'+end);
                } else{
                    return a+out;
                }
            });
        };

        // recursive set mode
        value = solveMode(value);

        let radToDeg = mode == 'deg' ? '(180/pi)*' : '';
        value = value.replace(/((asin|acos|atan)\()/g, `${radToDeg}$1`);

        if(!exact){
            // pre mathjs
            let mathJSVars = {
                'pi': Math.PI,
                'e': Math.E
            };
            Object.keys(mathJSVars).forEach(str => {
                value = value.replace(new RegExp(`^\s*${str}\s*$`, 'g'), `(${mathJSVars[str]})`);
            });
        }

        value = value.replace(/\)\(/g, ')*(');
        return value;
    }

    solve(mode, checkValidity = true) {
        if(checkValidity && !this.isValid(mode)[0]){
            throw new Error('invalid');
        }

        let eq = this.preSolve(mode);

        eq = eq.replace(/\!/g, '^j');
        eq = Algebrite.run(eq);
        eq = eq.replace(/\^j/g, '!');

        if(/^Stop:\s+/.test(eq))
            throw new Error(eq);

        // check if equation needs solving
        if(/^[1-9]+$/.test(eq))
            return eq;

        else
            return math.eval(eq).toString();
    }

    isValid(mode) {
        let valid = true,
            bans = [
            /(\+|\-|\*|\/)(\+|\*|\/)/,
            /---+/,
            /Ans/
        ];
        let err = '';

        let eq = this.preSolve();

        bans.forEach((ban) => {
            if(ban.test(eq)){
                valid = false;
                err = 'bad input';
            }
        });

        // ban multiple decimals in
        // one number eg 5.4.3
        eq.split(/[^(0-9)|\.]+/).forEach(section => {
            if(section.split('.').length > 2){
                err = 'bad input';
                valid = false;
            }
        });

        let solution = '';
        if(valid){
            try{
                let eqClone = new Equation(eq);
                solution = eqClone.solve(mode, false);
            } catch(e){
                err = e.message;
                valid = false;
            }
        }

        if(solution.indexOf('i') !== -1){
            valid = false;
            err = 'imaginary';
        }

        return [valid, err];
    }
}



if(typeof module !== 'undefined') 
    module.exports = Equation;
else if(typeof window == 'object')
    window.Equation = Equation;