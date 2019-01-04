let calculator = {
    ini: function(options){
        this.storage = options.storage;
        let storage = this.storage;

        if(typeof options.selector !== undefined){
            this.selector = options.selector;

            // resume state
            if(storage.m != "0") $("#m-status").text("m");
            $(options.selector.radDeg).text(localStorage.radDeg);

            $('.before').text(storage.before);
            this.screen.value(storage.screen);
        }
    },

    selector : {},
    options : {},

    screen: {
        value: function(val) {
            if(typeof val !== 'undefined'){
                calculator.storage.screen = val;
                $(calculator.selector.screen).text(val);
            } 

            else{
                return $(calculator.selector.screen).text();
            }

            if(val != calculator.calculate()){
                $('.before').hide();
                let after = calculator.calculate();
                if(!isNaN(after)) $('.after').text(after).show();
            }

            else{
                $('.after').hide();
            }
        },

        add: function(char) {
            let val = this.value(),
                segments = val.split(' '),
                lastSegment = segments[segments.length-1],
                isZero = lastSegment == 0 && lastSegment.split('.').length == 1;


            // ban these repeated characters
            let noRepeat = [
                '+','-','x','/'
            ];
            let isRepeate = noRepeat.includes(char) && lastSegment == char;


            // add spaces to separate data types
            let type = (str) => {
                let out,
                    cats = {
                    'op': /\+|-|x|\//,
                    'digit': /([0-9]|\.|^%|P|e|\^)$/,
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


            if(isZero && !eceptions.includes(char) && type(char) !== 'close'){
                val = val.replace(/0$/, char);
                calculator.screen.value(val);
            } 

            else if(!isZero || char != 0){
                calculator.screen.value(val+char);
            }
        },

        lastSegment: function() {
            this.get(val.split(' ').pop());
        },

        clear: function(){
            let val = calculator.screen.value(),
                split = val.split(' ');

            split.pop();
            val = split.join(' ') || 0;
            calculator.screen.value(val);
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

        // vars
        let vars = {
            '%': '0.01',
            'P': Math.PI,
            'e': Math.E
        };

        Object.keys(vars).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `(${vars[str]})`);
        });

        // operators
        let ops = {
            'x': '*',
            'mod': '%',
            'ln': 'log'
        };
        Object.keys(ops).forEach(str => {
            value = value.replace(new RegExp(str, 'g'), `${ops[str]}`);
        });

        // set mode
        value = value.replace(/([a-z]{3}\()/, `$1${storage.radDeg} `);

        console.log(value);

        // calculate
        value = math.eval(parseFloat(math.eval(value)).toPrecision(12));

        return value;
    },

    functions: {
        clear: () => {
            calculator.storage.before = '';
            $('.before').text('');
            calculator.screen.clear();
        },

        calculate: () => {
            let before = calculator.format(calculator.screen.value()),
                value = calculator.calculate();

            if(before != value){
                calculator.storage.before = before;
                $('.before').text(before).show();

                calculator.screen.value(value);
            }
        },

        radDeg: function() {
            let storage = calculator.storage;

            if($(calculator.selector.radDeg).text() === 'rad'){
                $(calculator.selector.radDeg).text('deg');
                storage.radDeg = 'deg';
            }

            else if($(calculator.selector.radDeg).text() === 'deg'){
                $(calculator.selector.radDeg).text('rad');
                storage.radDeg = 'rad';
            }
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
