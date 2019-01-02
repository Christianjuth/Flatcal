let calculator = {
    ini: function(options){
        this.storage = options.storage;
        let storage = this.storage;

        options.max = options.max || 15;
        options.max = Math.min(Math.round(($("#input-container").width() / 18) - 1), options.max);

        if(typeof options.selector !== undefined){
            $.each(options.selector, function(key, data){
                calculator.selector[key] = $(data);
            });

            $.each(options.options, function(key, data){
                calculator.options[key] = data;
            });

            // resume state
            this.options.maxLength = options.max;
            if(storage.m != "0") $("#m-status").text("m");
            $(options.selector.radDeg).text(localStorage.radDeg);

            if(storage.op === '' || storage.second === '')
                this.screen.set(storage.first);
            else
                this.screen.set(storage.second);
        }
    },

    value: function() {
        return parseFloat(this.screen.get());
    },

    selector : {},
    options : {},

    numberClicked: function(lastButtonClicked){
        let storage = this.storage;

        if(storage.clear == true) this.screen.clear();

        if(storage.op == ""){
            if(storage.first.replace(/-/g,"").replace(/\./g,"").length < this.options.maxLength){
                storage.first += lastButtonClicked;
                this.screen.set(storage.first, false);
            }
        }
        else{
            if(storage.second.replace(/(-|\.)/g,"").length < this.options.maxLength){
                storage.second += lastButtonClicked;
                this.screen.set(storage.second, false);
            }
        }
    },

    screen: {
        set: function(number) {
            number = String(number);

            if(number == '') number = '0';

            if(number.indexOf('.') != -1 && number !== '-0'){
                let splitNumber = number.split('.');
                number = `${parseInt(splitNumber[0])}.${splitNumber[1]}`;
            }

            else if(number != "-0") number = String(parseInt(number));

            var valid = (number != "" && number != undefined && number != "undefined"); //validate number
            if(number == "NaN" || !isFinite(number) || number.split(".")[0].replace(/-/,"").length > calculator.options.maxLength || !valid){
                calculator.screen.clear();
                $(calculator.selector.screen).text("ERROR");
                return false;
            }

            if(number.replace(/-/,"").length <= calculator.options.maxLength && valid){
                calculator.selector.screen.text(calculator.parse.commas(number));
            }

            else if(number.split(".")[0].replace(/-/,"").length < calculator.options.maxLength && valid){
                let maxLength = calculator.options.maxLength - number.split(".")[0].length,
                    value = calculator.parse.commas(math.round(parseFloat(number), maxLength));

                calculator.selector.screen.text(value);
            }

            return calculator.selector.screen.text().replace(/,/g,"");
        },

        get: function(){
            return calculator.selector.screen.text().replace(/,/g,"");
        },

        value: function() {
            return parseFloat(this.get());
        },

        length: function(){
            return this.get().replace(/\./g,"").replace(/-/g,"").length;
        },

        clear: function(){
            let storage = calculator.storage;

            if(storage.second !== '') storage.lastSecond = storage.second;
            storage.clear= false;
            storage.first = '0';
            storage.second = '';
            calculator.selector.screen.text('');
            calculator.animate.op();
            storage.op = '';
            calculator.screen.set(0);
        }
    },

    operator: function(operator = "") {
        let storage = this.storage;

        if(storage.op !== ''){
            this.calculate(false, true);
            storage.clear = false;
            storage.op = operator;
            this.animate.op(operator);
        }

        else{
            storage.clear = false;
            storage.op = operator;
            this.animate.op(operator);
        }
    },

    calculate: function(clearVaulesAfter, fromOpp){
        let storage = this.storage,
            first,
            second,
            overall;

        if(storage.op !== '' && (storage.second !== '' || !fromOpp)){
            if(!['0',''].includes(this.second)) this.lastSecond = this.second;

            first = parseFloat(storage.first);

            if(storage.second !== '')
                second = parseFloat(storage.second);
            else
                second = parseFloat(storage.lastSecond);

            switch(storage.op) {
                case 'plus':
                    overall = first + second;
                    break;
                case 'subtract':
                    overall = first - second;
                    break;
                case 'multiply':
                    overall = first * second;
                    break;
                case 'divide':
                    overall = first / second;
                    break;
                case 'mod':
                    overall = first % second;
                    break;
                case 'pow-of-y':
                    overall = Math.pow(first, second);
                    break;
                case 'square-root-y':
                    overall = math.nthRoot(first, second);
                    break;
            };

            this.animate.op();
            storage.first = String(overall);
            storage.second = '';

            // make input flash incase result
            // is the same as current screen value
            $(calculator.selector.screen).text('');
            setTimeout(() => {
                calculator.screen.set(overall);
            }, 50);

            if(clearVaulesAfter === true) this.clear = true;
        }
    },

    mathFunctions: {
        //static functions
        pi: () => {
            let s = calculator.storage,
                val = calculator.screen.value();

            return Math.PI * (val !== 0 ? val : 1);
        },

        e: () => {
            let s = calculator.storage,
                val = calculator.screen.value();

            return Math.E * (val !== 0 ? val : 1);
        },

        //basic functions
        pow: (mode, x, y) => math.pow(x, y),

        nthroot: (mode, x, n) => {
            try {
                let negate = n % 2 == 1 && x < 0;
                if(negate)
                    x = -x;
                let possible = Math.pow(x, 1 / n);
                n = Math.pow(possible, n);
                if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
                    return negate ? -possible : possible;
            } catch(e){}
        },

        ln: (mode, x) => Math.log(x),

        log: (mode, x, y) => math.log(x, y),


        //trig functions
        sin: (mode, x) => {
            return math.sin(math.unit(x, calculator.storage.radDeg));
        },

        cos: (mode, x) => {
            return math.cos(math.unit(x, calculator.storage.radDeg));
        },

        tan: (mode, x) => {
            return math.tan(math.unit(x, calculator.storage.radDeg));
        },

        sinh: (mode, x) => {
            return math.sinh(math.unit(x, calculator.storage.radDeg));
        },

        cosh: (mode, x) => {
            return math.cosh(math.unit(x, calculator.storage.radDeg));
        },

        tanh: (mode, x) => {
            return math.tanh(math.unit(x, calculator.storage.radDeg));
        },

        asin: (mode, x) => {
            return math.asin(x) * (mode === 'rad' ? 1 : (180 / Math.PI));
        },

        acos: (mode, x) => {
            return math.acos(x) * (mode === 'rad' ? 1 : (180 / Math.PI));
        },

        atan: (mode, x) => {
            return math.atan(x) * (mode === 'rad' ? 1 : (180 / Math.PI));
        },

        asinh: function(mode, x) {
            return Math.asinh(x);
        },

        acosh: function(mode, x) {
            return Math.acosh(x);
        },

        atanh: function(mode, x) {
            return Math.atanh(x);
        }
    },

    math: function(fun, x, y){
        let storage = calculator.storage,
            mode = calculator.storage.radDeg,
            result = calculator.mathFunctions[fun](mode, parseFloat(x), parseFloat(y));

        if(storage.op === '')
            storage.first = result;
        else
            storage.second = result
        calculator.screen.set(result);
    },

    event: {
        addDecimal : function() {
            let storage = calculator.storage;

            if(storage.clear == true) calculator.screen.clear();

            if(calculator.screen.get().indexOf('.') == -1){
                if(storage.op === ''){
                    storage.first = storage.first + '.';
                    calculator.screen.set(storage.first);
                }

                else{
                    if(storage.second === '.' || storage.second === '') storage.second = '0.';
                    storage.second = storage.second + ".";
                    calculator.screen.set(storage.second);
                }
            }
        },

        posNeg: function() {
            let storage = calculator.storage;

            if(storage.op === ''){
                if(storage.first.length == 0) storage.first = "-0";
                else if(storage.first.indexOf("-") == -1) storage.first = "-" + storage.first;
                else storage.first = storage.first.replace(/-/g,"");
                calculator.screen.set(storage.first);
            }

            if(storage.op !== ''){
                if(storage.second.length == 0) storage.second = "-0";
                else if(storage.second.indexOf("-") == -1) storage.second = "-" + storage.second;
                else storage.second = storage.second.replace(/-/g,"");
                calculator.screen.set(storage.second);
            }
        },

        radDeg: function() {
            let storage = calculator.storage;

            if(calculator.selector.radDeg.text() === 'rad'){
                $(calculator.selector.radDeg).text('deg');
                storage.radDeg = 'deg';
            }

            else if(calculator.selector.radDeg.text() === 'deg'){
                $(calculator.selector.radDeg).text('rad');
                storage.radDeg = 'rad';
            }
        },

        percentage: function(){
            let storage = calculator.storage;

            if(storage.op === ''){
                storage.first = String(1 * (storage.first * 0.01));
                storage.clear = true;
                return calculator.screen.set(storage.first);
            }

            else{
                storage.second = String(storage.first * (storage.second * 0.01));
                storage.clear = true;
                return calculator.screen.set(storage.second);
            }
        },

        sq: () => {
            let storage = calculator.storage;

            if(storage.op === ''){
                storage.first = String(storage.first * storage.first);
                storage.clear = true;
                calculator.screen.set(storage.first);
            }

            else{
                storage.second = String(storage.second * storage.second);
                storage.clear = true;
                calculator.screen.set(storage.second);
            }
        },

        sqrt: () => {
            let storage = calculator.storage;
            if(storage.op == ""){
                storage.first = String(Math.sqrt(storage.first));
                storage.clear = true;
                calculator.screen.set(storage.first);
            }

            else{
                storage.second = String(Math.sqrt(storage.second));
                storage.clear = true;
                calculator.screen.set(storage.second);
            }
        }
    },

    //memory functions
    m: {
        recall: () => {
            if(calculator.op == "")
                calculator.first = calculator.storage.m;
            else
                calculator.second = calculator.storage.m;

            calculator.screen.set(calculator.storage.m);
        },

        clear: () => {
            calculator.storage.m = 0;
            $("#m-status").text("");
        },

        minus: function() {
            calculator.storage.m -= calculator.value();
            if(calculator.storage.m != "0") $("#m-status").text("m");
        },

        plus: function() {
            calculator.storage.m = parseFloat(calculator.storage.m) + calculator.value();
            if(calculator.storage.m != "0") $("#m-status").text("m");
        }
    },

    parse: {
        commas: function(x) {
            // split string at . so 
            // decimal is not effected
            let parts = x.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        }
    },

    animate: {
        op: (opp) => {
            let $selector = $('#'+opp);

            $(".opp").css({"-webkit-transform" : "scale(1)"});

            if(calculator.storage.op != undefined){
                $selector.css({"-webkit-transform" : "scale(0.90)"});
                setTimeout(() => {
                    $selector.css({"-webkit-transform" : "scale(0.95)"});
                }, 100);
            }

            else{
                $selector.css({"-webkit-transform" : "scale(1)"});
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
                calculator.screen.set(number);
                if(calculator.op== "") calculator.first = number;
                else calculator.second = number;
            }

            else{
                calculator.selector.screen.text("ERROR");
                calculator.screen.clear();
            }
            $input.remove();
        }
    }
};
