class Equation {

    constructor(equation) {
        this.equation = equation;
        this.beautify();
        return this;
    }

    beautify() {
        let equation = this.equation,
            opens = (equation.match(/\(/g) || []).length,
            closes = (equation.match(/\)/g) || []).length;

        // math parentheses
        if(opens > closes) equation += ')'.repeat(opens - closes);
        else equation = '( '.repeat(closes - opens) + equation;

        // remove extra parentheses at start/end
        if(/^\(+[^(]*\)+$/.test(equation) && /^\(+[^)]*\)+$/.test(equation))
            equation = equation.replace(/(^\(|\)$)/g,'');
        

        // remove * next to ( )
        // eq 4*(3+3) --> 4(3+3)
        equation = equation.replace(/(\)\*)/g,')').replace(/(\*\()/g,'(');

        return this.equation = equation;
    }

    toString() {
        return this.equation;
    }

    solveForRoot(eq) {

        eq = eq.split('rt');
        let middle = eq.splice(-1)[0];
        eq = eq.join('rt');

        let end,
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

        let out = `${eq}^(1/${middle})${end}`;
        if(out.indexOf('rt') !== -1) out = this.solveForRoot(out);

        return out;
    }

    preSolve(mode = 'rad', exact = true) {
        let value = this.equation;

        if(value.indexOf('rt') !== -1)
            value = this.solveForRoot(value);

        // vars
        let algebriteVars = {
            'P': 'pi',
            'T': '2pi'
        };
        Object.keys(algebriteVars).forEach(str => {
            let insert = algebriteVars[str]; 
            insert = /^\s*\(.*\)\s*$/.test(insert) ? insert : `(${insert})`;
            value = value.replace(new RegExp(str, 'g'), insert);
        });

        // operators
        let ops = {
            '%': '* 0.01',
            'ln': 'log',
            '÷': '/'
        };
        Object.keys(ops).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `${ops[str]}`);
        });

        // set mode
        value = value.replace(/((a|)(sin|cos|tan)\()/g, function(x, trig, a) {
            let degToRad = mode == 'deg' ? '(pi/180)*' : '';

            if(a) return trig;
            else  return trig+degToRad;
        });

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

        return value;
    }

    solve(mode) {
        let eq = this.preSolve(mode);

        if(eq.match(/(sin|cos|tan|Ans)/)){
            eq = eq.replace(/\!/g, '^j');
            eq = Algebrite.run(eq);
            eq = eq.replace(/\^j/g, '!');
        }

        // check if equation needs solving
        if(/^[1-9]+$/.test(eq))
            return eq;

        else
            return math.eval(eq).toString();
    }

    isValid() {
        let valid = true,
            bans = [
            /(\+|\-){2}/,
            /Ans/
        ];

        let eq = this.preSolve();

        bans.forEach((ban) => {
            if(ban.test(eq))
                valid = false;
        });

        // ban multiple decimals in
        // one number eg 5.4.3
        eq.split(/[^(0-9)|\.]+/).forEach(section => {
            if(section.split('.').length > 2) 
                valid = false;
        });

        if(valid){
            try{
                let eqClone = new Equation(eq);
                eqClone.solve();
            } catch(e){
                valid = false;
            }
        }

        return valid;
    }
}



if(typeof module !== 'undefined') 
    module.exports = Equation;
else if(typeof window == 'object')
    window.Equation = Equation;