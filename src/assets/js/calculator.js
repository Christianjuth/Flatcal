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
            let val = this.value(),
                segments = val.split(' '),
                lastSegment = segments[segments.length-1],
                isZero = lastSegment == 0 && lastSegment.split('.').length == 1;


            // ban these repeated characters
            let noRepeat = [
                '+','-','x','/', 'mod', '^'
            ];
            let isRepeate = noRepeat.includes(char) && lastSegment.indexOf(char) != -1;


            // add spaces to separate data types
            let type = (str) => {
                let out,
                    cats = {
                    'op': /\+|-|x|\//,
                    'digit': /([0-9]|\.|^%|P|e|!)$/,
                    'close': /\)/
                };

                Object.keys(cats).forEach((cat, i) => {
                    if(cats[cat].test(str)) out = cat;
                });

                return out;
            }
            if(type(char) != type(lastSegment)) char = ' '+char;


            // exceptions
            let eceptions = [
                '.',
                '0',
                '%'
            ];


            if(!isRepeate && isZero && !eceptions.includes(char) && type(char) !== 'close'){
                val = val.replace(/0$/, char);
                calculator.screen.value(val);
            } 

            else if(!isRepeate && (!isZero || char != 0)){
                if(lastSegment.length < 15 || type(char) != type(lastSegment)){
                    calculator.screen.value(val+char);
                }
            }
        },

        lastSegment: function() {
            this.get(val.split(' ').pop());
        },

        clear: function(){
            let val = calculator.screen.value(),
                split = val.split(' ');
            
            if(split.length == 1){
                calculator.screen.allClear();
            } else{
                split.pop();
                calculator.screen.value(split.join(' ') || 0);
            }
        },

        allClear: () => {
            calculator.storage.before = '';
            $(calculator.selector.screenBefore).text('');
            $(calculator.selector.screenWrap).removeClass('before').removeClass('after');

            calculator.screen.value('0');
        },

        textWidth: function(text){
            $input = $(`<p class="simulate-input">${text}</p>`);
            let width = $input.appendTo($('.input-wrap')).width();
            return width;
        }
    },

    operator: function(op) {
        let storage = this.storage,
            value = this.screen.value();

        let operators = {
            multiply: 'x',
            subtract: '-',
            plus: '+',
            divide: '/'
        };

        this.screen.add(operators[op]);
    },

    format: (value) => {
        // close parentheses
        let opens = (value.match(/\(/g) || []).length,
            closes = (value.match(/\)/g) || []).length;

        if(opens > closes) value += ' )'.repeat(opens - closes);
        else value = '( '.repeat(closes - opens) + value;

        return value.replace(/\s+/,' ');
    },

    calculate: () => {
        let storage = calculator.storage,
            value = calculator.screen.value();

        value = calculator.format(value);


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
            'P': 'pi',
            'Ans': $.parseJSON(calculator.storage.history).pop()
        };
        Object.keys(algebriteVars).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `(${algebriteVars[str]})`);
        });

        // operators
        let ops = {
            'x': '*',
            '%': '* 0.01',
            'mod': '%',
            'ln': 'log'
        };
        Object.keys(ops).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `${ops[str]}`);
        });

        // set mode
        let degToRad = storage.radDeg == 'deg' ? '(pi/180)' : 1;
        value = value.replace(/(\s+(sin|cos|tan)\()/, `$1${degToRad} * `);

        let radToDeg = storage.radDeg == 'deg' ? '(180/pi)' : 1;
        value = value.replace(/(\s+(asin|acos|atan)\()/, `${radToDeg} * $1`);

        // calculate
        value = value.replace(/\!/g, 'j');
        value = Algebrite.run(value);
        value = value.replace(/\*j/g, '!');


        // pre mathjs
        let mathJSVars = {
            'pi': Math.PI,
            'e': Math.E
        };
        Object.keys(mathJSVars).forEach(str => {
            value = value.replace(new RegExp(`^\s*${str}\s*$`, 'g'), `(${mathJSVars[str]})`);
        });

        value = math.eval(value).toString();


        return value;
    },

    history: {
        position: 0,
        future: '',

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

            if(this.position > 0){
                this.position--;
                let history = $.parseJSON(storage.history);
                value = history.slice(this.position * -1)[0];
            } else{
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
            let before = calculator.format(calculator.screen.value()),
                value = calculator.calculate();

            if(before != value){
                calculator.storage.before = before;

                let history = $.parseJSON(calculator.storage.history);
                history.push(before);
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
        }
    },

    clipboard: {
        copy: (text) => {
            let $input = $('<input/>');
            $input.val(text);
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
                let storage = calculator.storage;
                calculator.screen.set(number);
                if(storage.op == '') storage.first = number;
                else storage.second = number;
            }

            else{
                calculator.screen.clear();
            }
            $input.remove();
        }
    }
};