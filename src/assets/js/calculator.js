class Calculator {

    constructor(config) {
        this.config = config;
        let storage = this.storage = config.storage;


        // resume state
        $(config.radDeg).prepend(`<span>${storage.radDeg}</span>`);
        this.value(storage.screen);


        this.historyPosition = 0;
        this.historyFuture = this.value();


        return this;
    }



    historyUp() {
        let storage = this.storage,
            history = $.parseJSON(storage.history);

        if(this.historyPosition == 0)
            this.historyFuture = this.value();

        if(this.historyPosition < history.length)
            this.historyPosition++;
        
        let value = history.slice(this.historyPosition * -1)[0];
        this.value(value);
    }


    historyDown() {
        let storage = this.storage,
            value;

        // prevent going sub zero
        if(this.historyPosition > 0)
            this.historyPosition--;

        if(this.historyPosition > 0){
            let history = $.parseJSON(storage.history);
            value = history.slice(this.historyPosition * -1)[0];
        } 

        else if(this.historyFuture){
            value = this.historyFuture;
        }

        this.value(value);  
    }

    historyRecord(eq) {
        let storage = this.storage,
            history = $.parseJSON(storage.history);

        if(eq !== history[history.length-1]){
            history.push(eq);
            history = history.slice(-50);
            storage.history = JSON.stringify(history);
        }
    }



    fontSize(text){
        let config = this.config,
            scaleOutput = 600,
            output;

        // calculate text width
        let $input = $(`<p class="simulate-input">${text}</p>`),
            textWidth = $input.appendTo($('.input-wrap')).width();
        $input.remove();

        let screenWidth = $(config.screen).width(),
            space = screenWidth - textWidth;

        if(space <= 50)
            output = (space + scaleOutput)/(50 + scaleOutput) + 'em';

        else
            output = '';

        return output;
    }




    value(text) {
        let storage = this.storage,
            history = $.parseJSON(storage.history),
            mode = storage.radDeg,
            config = this.config;

        // setter
        if(typeof text !== 'undefined'){
            storage.screen = text;

            config.screen
            .text(text)
            .css({'font-size': this.fontSize(text)});
        } 

        // getter
        else{
            return config.screen.text();
        }

        let eq = new Equation(text.replace(/Ans/g, `(${history.slice(-1)[0]})`)),
            solution = eq.isValid() ? eq.solve(mode) : false;

        if(solution && solution !== eq.toString()){
            config.screenWrap.removeClass('before');

            if(!isNaN(solution)){
                config.screenWrap.addClass('after');
                config.screenAfter.text(solution);
            }
        }

        else{
            config.screenWrap.removeClass('after');
        }
    }


    radDeg() {
        let storage = this.storage,
            config = this.config;

        if(storage.radDeg === 'rad'){
            storage.radDeg = 'deg';
            config.radDeg.find('span').text('deg');
        }

        else if(localStorage.radDeg == 'deg'){
            storage.radDeg = 'rad';
            config.radDeg.find('span').text('rad');
        }

        // force screen refresh
        this.value(this.value());
    }



    add(char) {
        let storage = this.storage,
            history = $.parseJSON(storage.history),
            val = this.value();

        char = char.toString();

        // replace zero if needed
        if(val === '0' && char != '.')
            val = char;
        else
            val += char;

        // validate
        let eqIn = val.replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq1 = new Equation(eqIn),
            eq2 = new Equation(eqIn+' 1');

        if(eq1.isValid() || eq2.isValid())
            this.value(val);
    }


    calculate() {
        let config = this.config,
            storage = this.storage,
            history = $.parseJSON(storage.history),
            val = this.value().replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq = new Equation(val),
            before = eq.toString();

        if(before !== eq.solve()){
            storage.before = before;
            config.screenBefore.text(before);
            config.screenWrap.addClass('before');

            this.historyRecord(before);
        }

        this.value(eq.solve(storage.radDeg));
    }


    clear() {
        this.historyPosition = 0;
        let val = this.value();

        if(/((s|i|n|c|o|t|a|l|r|g){2,4}[0-9]*)(\(|)$/i.test(val))
            val = val.replace(/((s|i|n|c|o|t|a|l|r|g){2,4}[0-9]*)(\(|)$/i, '');
        else
            val = val.substr(0,val.length-1);
        

        if(val.length == 0){
            this.allClear();
        }
        else{
            this.historyFuture = val;
            this.value(val);
        }
    }

    allClear() {
        let storage = this.storage,
            config = this.config;
        
        storage.before = '';
        config.screenBefore.text('');
        config.screenWrap.removeClass('before').removeClass('after');

        this.historyPosition = 0;
        this.historyFuture = '0';
        this.value('0');
    }


    copy() {
        let $input = $('<input/>'),
            eq = new Equation(this.value());

        $input.val(eq.toString());
        $('body').append($input);
        $input.select();
        document.execCommand('copy');
        $input.remove();
    }


    paste() {
        let $input = $('<input/>');
        $('body').append($input);
        $input.select();
        document.execCommand('paste');
        let number = parseFloat($input.val());

        if(!isNaN(parseFloat(number))){
            this.add(number);
        }
        $input.remove();
    }
}








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

        console.log(eq);

        bans.forEach((ban) => {
            if(ban.test(eq))
                valid = false;
        });

        try{
            math.eval(eq);
            valid = valid && true;
        } catch(e){
            valid = valid && Algebrite.run(eq).indexOf('Stop') == -1;
        }

        return valid;
    }
}



if(module) module.exports = Equation;