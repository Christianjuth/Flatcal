let calculator = {
    ini: function(options){
        this.storage = options.storage;
        let storage = this.storage;

        if(typeof options.selector !== undefined){
            this.selector = options.selector;

            // resume state
            if(storage.m != "0") $("#m-status").text("m");
            $(options.selector.radDeg).text(localStorage.radDeg);

            if(storage.before != ''){
                $(calculator.selector.screenWrap).addClass('before');
                $(calculator.selector.screenBefore).text(storage.before);
            }
            this.screen.value(storage.screen);
        }
    },

    selector : {},
    options : {},

    screen: {
        value: function(val) {
            if(typeof val !== 'undefined'){
                calculator.storage.screen = val;

                let screenWidth = $(calculator.selector.screen).width();
                let textWidth = calculator.screen.textWidth(val);
                let space = screenWidth - textWidth;

                if(space <= 50){
                    let scale = 300;
                    $(calculator.selector.screen).css({'font-size': (space + scale)/(50 + scale) + 'em'});
                    $(calculator.selector.screen).text(val);
                }

                else{
                    $(calculator.selector.screen).css({'font-size': ''});
                    $(calculator.selector.screen).text(val);
                }
            } 

            else{
                return $(calculator.selector.screen).text();
            }

            if(val != calculator.calculate()){
                $(calculator.selector.screenWrap).removeClass('before');
                let after = calculator.calculate();

                if(!isNaN(after)){
                    $(calculator.selector.screenWrap).addClass('after');
                    $(calculator.selector.screenAfter).text(after);
                }
            }

            else{
                $(calculator.selector.screenWrap).removeClass('after');
            }
        },

        add: function(char) {
            let val = this.value();

            // replace zero if needed
            if(val == 0)
                val = char;
            else
                val += char;

            // validate
            if(calculator.validate(val+' 1') || calculator.validate(val))
                calculator.screen.value(val);
        },

        lastSegment: function() {
            this.get(val.split(' ').pop());
        },


        clear: function(){
            calculator.history.position = 0;
            let val = calculator.screen.value();

            if(/([a-z]{3,4}[0-9]*|ln)\($/.test(val))
                val = val.replace(/([a-z]{3,4}[0-9]*|ln)\($/, '');
            else
                val = val.substr(0,val.length-1);
            

            if(val.length == 0){
                calculator.screen.allClear();
            }
            else{
                calculator.history.future = val;
                calculator.screen.value(val);
            }
        },


        allClear: () => {
            calculator.storage.before = '';
            $(calculator.selector.screenBefore).text('');
            $(calculator.selector.screenWrap).removeClass('before').removeClass('after');

            calculator.history.position = 0;
            calculator.history.future = '0';
            calculator.screen.value('0');
        },

        textWidth: function(text){
            $input = $(`<p class="simulate-input">${text}</p>`);
            let width = $input.appendTo($('.input-wrap')).width();
            $input.remove();
            return width;
        }
    },


    solveForRoot: (eq) => {

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

        if(out.indexOf('rt') !== -1) out = calculator.solveForRoot(out);

        return out;
    },



    complete: (equation) => {
        let opens = (equation.match(/\(/g) || []).length,
            closes = (equation.match(/\)/g) || []).length;

        // math parentheses
        if(opens > closes) equation += ')'.repeat(opens - closes);
        else equation = '( '.repeat(closes - opens) + equation;

        // substitute Ans
        equation = equation.replace(/Ans/g, $.parseJSON(calculator.storage.history).pop());

        return equation;
    },



    format: (value, exact = true) => {
        // close parentheses
        let storage = calculator.storage;

        value = calculator.complete(value);

        if(value.indexOf('rt') !== -1)
            value = calculator.solveForRoot(value);

        // rationalize
        let rationalize = function(num) {
          if (Math.round(num) === num) return num;
          var parts = num.toString().split('.');
          return '(' + (parts[0]==='0' ? parts[1] : parts[0]+parts[1]) + '/1'
                     + Array(parts[1].length+1).join('0') + ')';
        };
        value = value.split(' ').map((part) => {
            return /^\s*[0-9]+\.[0-9]+\s*$/.test(part) ? rationalize(part) : part;
        }).join(' ');


        // vars
        let algebriteVars = {
            'P': 'pi'
        };
        Object.keys(algebriteVars).forEach(str => {
            let insert = algebriteVars[str]; 
            insert = /^\s*\(.*\)\s*$/.test(insert) ? insert : `(${insert})`;
            value = value.replace(new RegExp(str, 'g'), insert);
        });

        // operators
        let ops = {
            '%': '* 0.01',
            'ln': 'log'
        };
        Object.keys(ops).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `${ops[str]}`);
        });

        // set mode
        value = value.replace(/((a|)(sin|cos|tan)\()/g, function(x, trig, a) {
            let degToRad = storage.radDeg == 'deg' ? '(pi/180)*' : '';

            if(a) return trig;
            else  return trig+degToRad;
        });

        let radToDeg = storage.radDeg == 'deg' ? '(180/pi)*' : '';
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
    },


    validate: (equation) => {
        let valid = true,
            bans = [
            /(\+|\-){2}/,
            /([0-9]|\.){15}/
        ];

        equation = calculator.format(equation);

        bans.forEach((ban) => {
            if(ban.test(equation))
                valid = false;
        });

        try{
            math.eval(equation);
            valid = valid && true;
        } catch(e){
            valid = false;
        }

        return valid;
    },




    calculate: () => {
        let storage = calculator.storage,
            value = calculator.screen.value();

        // deside wether Algebrite
        // is needs to simplify
        if(value.match(/(sin|cos|tan)/)){
            value = calculator.format(value);
            console.log(value);
            value = value.replace(/\!/g, '^j');
            value = Algebrite.run(value);
            value = value.replace(/\^j/g, '!');
        }

        value = calculator.format(value, false);
        value = math.eval(value).toString();

        return value;
    },

    history: {
        position: 0,
        future: null,

        up: function() {
            let storage = calculator.storage,
                history = $.parseJSON(storage.history);

            if(this.position == 0)
                this.future = calculator.screen.value();

            if(this.position < history.length)
                this.position++;
            
            let value = history.slice(this.position * -1)[0];
            calculator.screen.value(value);
        },

        down: function() {
            let storage = calculator.storage;
            let value;

            // prevent going sub zero
            if(this.position > 0)
                this.position--;

            if(this.position > 0){
                let history = $.parseJSON(storage.history);
                value = history.slice(this.position * -1)[0];
            } 

            else if(this.future){
                value = this.future;
            }

            calculator.screen.value(value);  
        }
    },

    functions: {
        clear: () => {
            calculator.screen.clear();
        },

        allClear: () => {
            calculator.screen.allClear();
        },

        calculate: () => {
            let before = calculator.complete(calculator.screen.value()),
                value = calculator.calculate();

            if(before != value){
                calculator.storage.before = before;

                let history = $.parseJSON(calculator.storage.history);
                history.push(before.replace(/Ans/g, `${history.slice(-1)[0]}`));
                calculator.storage.history = JSON.stringify(history);

                $(calculator.selector.screenBefore).text(before);
                $(calculator.selector.screenWrap).addClass('before');
                calculator.screen.value(value);
            }
        },

        radDeg: function() {
            let storage = calculator.storage;

            if(localStorage.radDeg == 'rad'){
                storage.radDeg = 'deg';
                $(calculator.selector.radDeg).text('deg');
            }

            else if(localStorage.radDeg == 'deg'){
                storage.radDeg = 'rad';
                $(calculator.selector.radDeg).text('rad');
            }

            // force screen refresh
            calculator.screen.value(calculator.screen.value());
        },

        historyUp: () => {
            calculator.history.up();
        },

        historyDown: () => {
            calculator.history.down();
        },

        copy: () => {
            let $input = $('<input/>');
            let text = calculator.screen.value();
            $input.val(calculator.format(text));
            $('body').append($input);
            $input.select();
            document.execCommand('copy');
            $input.remove();
        },

        paste: function() {
            let $input = $('<input/>');
            $('body').append($input);
            $input.select();
            document.execCommand('paste');
            let number = parseFloat($input.val());

            if(!isNaN(parseFloat(number))){
                calculator.screen.add(number);
            }
            $input.remove();
        }
    }
};