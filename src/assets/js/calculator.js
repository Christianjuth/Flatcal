/*-------------------------------------------------------------------------------------
|   o88b.  .d8b.  db       .o88b. db    db db       .d8b.  d888888b  .d88b.  d8888b.  |
| d8P  Y8 d8' `8b 88      d8P  Y8 88    88 88      d8' `8b `~~88~~' .8P  Y8. 88  `8D  |
| 8P      88ooo88 88      8P      88    88 88      88ooo88    88    88    88 88oobY'  |
| 8b      88~~~88 88      8b      88    88 88      88~~~88    88    88    88 88`8b    |
| Y8b  d8 88   88 88booo. Y8b  d8 88b  d88 88booo. 88   88    88    `8b  d8' 88 `88.  |
|  `Y88P' YP   YP Y88888P  `Y88P' ~Y8888P' Y88888P YP   YP    YP     `Y88P'  88   YD  |
--------------------------------------------------------------------------------------*/



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
            if(storage.radDeg == "rad") this.rad();
            else this.deg();
            if(storage.m != "0") $("#m-status").text("m");

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

        return lastButtonClicked;
    },

    screen: {
        set: function(number) {
            number = String(number);

            if(number == "") number = "0";

            if(number.indexOf(".") != -1 && number != "-0") number = String(parseInt(number.split(".")[0]) + "." + number.split(".")[1]);

            else if(number != "-0") number = String(parseInt(number));

            var valid = (number != "" && number != undefined && number != "undefined"); //validate number
            if(number == "NaN"|| number.split(".")[0].replace(/-/,"").length > calculator.options.maxLength || !valid){
                calculator.screen.clear();
                calculator.selector.screen.text("ERROR");
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
                    overall = this.math.nthroot(first, second);
                    break;
            };

            calculator.screen.set(overall);
            this.animate.op();
            storage.first = String(overall);
            storage.second = '';

            if(clearVaulesAfter === true) this.clear = true;
        }
    },

    mathFunctions:{
        //static functions
        pi: () => String(Math.PI),

        e: () => Math.E,

        //basic functions
        pow: (x,y) => math.pow(x, y),

        nthroot: (x, n) => {
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

        in: (x) => Math.log(x),

        log: (x, y) => math.log(x, y),

        //trig functions
        sin: (x) => {
            return math.sin(math.unit(x, calculator.storage.radDeg));
        },

        cos: (x) => {
            return math.cos(math.unit(x, calculator.storage.radDeg));
        },

        tan: (x) => {
            return math.tan(math.unit(x, calculator.storage.radDeg));
        },

        sinh: (x) => {
            return math.sinh(math.unit(x, calculator.storage.radDeg));
        },

        cosh: (x) => {
            return math.cosh(math.unit(x, calculator.storage.radDeg));
        },

        tanh: (x) => {
            return math.tanh(math.unit(x, calculator.storage.radDeg));
        },

        asin: (x) => {
            if(calculator.storage.radDeg == "rad") return math.asin(x);
            else return math.asin(x) * (180 / Math.PI);
        },

        acos: (x) => {
            if(calculator.storage.radDeg == "rad") return math.acos(x);
            else return math.acos(x) * (180 / Math.PI);
        },

        atan: (x) => {
            if(calculator.storage.radDeg == "rad") return math.atan(x);
            else return math.atan(x) * (180 / Math.PI);
        },

        asinh : function(x) {
            return Math.asinh(x);
        },

        acosh : function(x) {
            return Math.acosh(x);
        },

        atanh : function(x) {
            return Math.atanh(x);
        }
    },

    math: function(fun, x, y){
        let result = calculator["mathFunctions"][fun](parseFloat(x),parseFloat(y));
        if(result !== false){
            if(calculator.op == "") return calculator.first = calculator.screen.set(result);
            else return calculator.second = calculator.screen.set(result);
        }
        else calculator.screen.get();
    },

    event: {
        addDecimal : function() {
            if(calculator.clear == true) calculator.screen.clear();

            if(calculator.screen.get().indexOf(".") == -1){
                if(calculator.op== ""){
                    calculator.first = calculator.first + ".";
                    calculator.screen.set(calculator.first);
                }

                else{
                    if(calculator.second == "." || calculator.second == "") calculator.second = "0.";
                    calculator.second = calculator.second + ".";
                    calculator.screen.set(calculator.second);
                }
            }

            return;
        },

        posNeg : function() {
            if(calculator.op== ""){
                if(calculator.first.length == 0) calculator.first = "-0";
                else if(calculator.first.indexOf("-") == -1) calculator.first = "-" + calculator.first;
                else calculator.first = calculator.first.replace(/-/g,"");
                calculator.screen.set(calculator.first);
            }

            if(calculator.op!= ""){
                if(calculator.second.length == 0) calculator.second = "-0";
                else if(calculator.second.indexOf("-") == -1) calculator.second = "-" + calculator.second;
                else calculator.second = calculator.second.replace(/-/g,"");
                calculator.screen.set(calculator.second);
            }

            return;
        },

        radDeg : function() {
            if(calculator.selector.radDeg.text() == "rad"){
                calculator.storage.radDeg = calculator.deg();
            }

            else if(calculator.selector.radDeg.text() == "deg"){
                calculator.storage.radDeg = calculator.rad();
            }

            return;
        },

        percentage: function(){
            if(calculator.op == ""){
                calculator.first = String(1 * (calculator.first * 0.01));
                calculator.clear = true;
                return calculator.screen.set(calculator.first);
            }

            else{
                calculator.second = String(calculator.first * (calculator.second * 0.01));
                calculator.clear = true;
                return calculator.screen.set(calculator.second);
            }
        },

        sq: () => {
            if(calculator.op == ""){
                calculator.first = String(calculator.first * calculator.first);
                calculator.clear = true;
                return calculator.screen.set(calculator.first);
            }

            else{
                calculator.second = String(calculator.second * calculator.second);
                calculator.clear = true;
                return calculator.screen.set(calculator.second);
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
    },

    rad: function() {
        this.selector.radDeg.text("rad");
        return "rad";
    },

    deg: function() {
        this.selector.radDeg.text("deg");
        return "deg";
    }
};
