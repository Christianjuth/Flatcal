/*-------------------------------------------------------------------------------------
|   o88b.  .d8b.  db       .o88b. db    db db       .d8b.  d888888b  .d88b.  d8888b.  |
| d8P  Y8 d8' `8b 88      d8P  Y8 88    88 88      d8' `8b `~~88~~' .8P  Y8. 88  `8D  |
| 8P      88ooo88 88      8P      88    88 88      88ooo88    88    88    88 88oobY'  |
| 8b      88~~~88 88      8b      88    88 88      88~~~88    88    88    88 88`8b    |
| Y8b  d8 88   88 88booo. Y8b  d8 88b  d88 88booo. 88   88    88    `8b  d8' 88 `88.  |
|  `Y88P' YP   YP Y88888P  `Y88P' ~Y8888P' Y88888P YP   YP    YP     `Y88P'  88   YD  |
---------------------------------------------------------------------------------------

---------------------------FUNCTIONS------------------------------
|                                                                |
|  ini(options)               - initiate the calculator          |
|  numberClicked              - called when number is clicked    |
|  screen                     - screen functions                 |
|    set(value)               - set screen value                 |
|    get                      - get screen value                 |
|    length                   - get screen length                |
|    clear                    - clear screen                     |
|
|
|  m                          - memory functions                 |
|    recall                   - get number in memory             |
|    clear                    - clear the current memory number  |
|
|
|
|
|
------------------------------------------------------------------

----------------------------VARIABLES-----------------------------
|                                                                |
|  calculator.max             - max legnth calculator is allowed |
|  calculator.screen.selector - selector for calculator screen   |
|
|
|
|
------------------------------------------------------------------*/



var calculator = {
    ini : function(options){
        if(options.max == undefined || options.max > 15) options.max = 15; //validate max screen size

        if(options.selector != undefined){
            this.screen.selector = options.selector;
            this.maxLength = Math.min(Math.round(($("#input-container").width() / 18) - 1), options.max); //define number max legnth
            this.lastSecond = "0";
            this.first = "0";
            this.second = "";
            this.op = "";
            if(localStorage.radDeg == "rad") this.rad();
            else this.deg();
            this.screen.clear();
        }

        else{
            console.error("bad or missing screen selector");
        }
    },

    numberClicked : function(lastButtonClicked){
        if(calculator.clear == true) calculator.screen.clear(); //calculator.screen.clears any previous values
        var validate = calculator.screen.get() == "0" && lastButtonClicked == 0 && calculator.screen.selector.text().indexOf(".") == -1;

        if(calculator.op== "" && validate != true){
            if(calculator.first.replace(/-/g,"").replace(/\./g,"").length < calculator.maxLength){
                if(this.first.indexOf(".") != -1) this.first = String(parseInt(this.first.split(".")[0]) + "." + this.first.split(".")[1] + lastButtonClicked);
                else this.first = String(parseInt(this.first + '' + lastButtonClicked));
                this.screen.set(this.first, false);
            }
        }
        else if(validate != true){
            if(calculator.second.replace(/-/g,"").replace(/\./g,"").length < calculator.maxLength){
                if(this.second.length == 0) this.second = String(lastButtonClicked);
                else if(this.second.indexOf(".") != -1) this.second = String(parseInt(this.second.split(".")[0]) + "." + this.second.split(".")[1] + lastButtonClicked);
                else this.second = String(parseInt(this.second + '' + lastButtonClicked));
                this.screen.set(this.second, false);
            }
        }

        return lastButtonClicked;
    },

    screen : {
        set : function(number, stripZeros) {
            number = String(number);
            if(number == "") number = "0";
            if(number.indexOf(".") != -1 && number != "-0") number = String(parseInt(number.split(".")[0]) + "." + number.split(".")[1]);
            else if(number != "-0") number = String(parseInt(number));
            var valid = (number != "" && number != undefined && number != "undefined"); //validate number
            if(number == "NaN"|| number.split(".")[0].replace(/-/,"").length > calculator.maxLength || !valid){
                calculator.screen.clear();
                calculator.screen.selector.text("ERROR");
                console.error("ERROR");
                return false;
            }

            if(number.replace(/-/,"").length <= calculator.maxLength && valid){
                calculator.screen.selector.text(calculator.parse.commas(number));
            }

            else if(number.split(".")[0].replace(/-/,"").length < calculator.maxLength && valid){
                calculator.screen.selector.text(math.round(parseFloat(number), calculator.maxLength - number.split(".")[0].length));
            }

            return calculator.screen.selector.text().replace(/,/g,"");
        },

        get: function(){
            return calculator.screen.selector.text().replace(/,/g,"");
        },

        length: function(){
            return this.get().replace(/\./g,"").replace(/-/g,"").length;
        },

        clear: function(){
            if(calculator.second != "") calculator.lastSecond = calculator.second;
            calculator.clear= false;
            calculator.first = "0";
            calculator.second = "";
            this.selector.text("");
            calculator.animate.op();
            calculator.op= "";
            overall = "";
            calculator.screen.set(0);
            return;
        }
    },

    operator: function(operator) {
        if(operator == undefined) operator = "";
        if(calculator.op != ""){
            calculator.calculate(false, false);
            calculator.clear= false;
            calculator.op = operator;
            calculator.animate.op(operator);
        }

        else{
            calculator.clear= false;
            calculator.op = operator;
            calculator.animate.op(operator);
        }

        return calculator.op;
    },

    calculate: function(clearVaulesAfter, fromOpp){
        var finalNumber = new Array();
        var output = "";
        if(this.second != "0" && this.second != "") this.lastSecond = this.second;

        if(calculator.second != ""){
            if(calculator.op== "plus"){
                overall = parseFloat(calculator.first) + parseFloat(calculator.second); //addition
            }

            else if(calculator.op== "subtract"){
                overall = parseFloat(calculator.first) - parseFloat(calculator.second); //subtraction
            }

            else if(calculator.op== "multiply"){
                overall = parseFloat(calculator.first) * parseFloat(calculator.second); //multiplication
            }

            else if(calculator.op== "divide"){
                overall = parseFloat(calculator.first) / parseFloat(calculator.second); //divition
            }

            else if(calculator.op== "mod"){
                overall = parseFloat(calculator.first) % parseFloat(calculator.second); //mod
            }

            else if(calculator.op== "pow-of-y"){
                overall = Math.pow(parseFloat(calculator.first), parseFloat(calculator.second));
            }

            else if(calculator.op== "square-root-y"){
                overall = this.math.nthroot(parseFloat(calculator.first), parseFloat(calculator.second));
            }

            calculator.screen.selector.text("");
            setTimeout(calculator.screen.set, 100, overall);
            setTimeout(calculator.animate.op, 150);

            calculator.first = String(overall);
            calculator.second = "";
            overall = "";

            if(clearVaulesAfter == true){
                calculator.clear= true;
            }
        }

        else if(calculator.lastSecond != "" && calculator.op!= "" && fromOpp != false){
            if(calculator.op== "plus"){
                overall = parseFloat(calculator.first) + parseFloat(calculator.lastSecond); //addition
            }

            else if(calculator.op== "subtract"){
                overall = parseFloat(calculator.first) - parseFloat(calculator.lastSecond); //subtraction
            }

            else if(calculator.op== "multiply"){
                overall = parseFloat(calculator.first) * parseFloat(calculator.lastSecond); //multiplication
            }

            else if(calculator.op== "divide"){
                overall = parseFloat(calculator.first) / parseFloat(calculator.lastSecond); //divition
            }

            else if(calculator.op== "mod"){
                overall = parseFloat(calculator.first) % parseFloat(calculator.lastSecond); //mod
            }

            else if(calculator.op== "pow-of-y"){
                overall = Math.pow(parseFloat(calculator.first), parseFloat(calculator.lastSecond));
            }

            else if(calculator.op== "square-root-y"){
                overall = this.math.nthroot(parseFloat(calculator.first), parseFloat(calculator.lastSecond));
            }

            calculator.screen.selector.text("");
            setTimeout(calculator.screen.set, 100, overall);
            setTimeout(calculator.animate.op, 150);

            calculator.first = String(overall);
            calculator.second = "";
            overall = "";

            if(clearVaulesAfter == true){
                calculator.clear= true;
            }
        }

        return;
    },

    mathFunctions:{
        //static functions
        pi : function(){
            if(calculator.op== ""){
                calculator.first = String(Math.PI);
                return  calculator.first;
            }

            else{
                calculator.second = String(Math.PI);
                return Math.PI;
            }
        },

        e : function() {
            return Math.E;
        },

        //basic functions
        pow : function(x,y) {
            calculator.first = String(Math.pow(x,y));
            return calculator.first;
        },

        nthroot : function(x, n) {
            try {
                var negate = n % 2 == 1 && x < 0;
                if(negate)
                    x = -x;
                var possible = Math.pow(x, 1 / n);
                n = Math.pow(possible, n);
                if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
                    return negate ? -possible : possible;
            } catch(e){}
        },

        //trig functions
        sin : function(x) {
            return math.sin(parseFloat(x));
        },

        log : function(x) {
            return math.log10(parseFloat(x));
        },

        cos : function(x) {
            if(localStorage.radDeg == "rad") return Math.cos(x);
            else return Math.cos( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, "");
        },

        tan : function(x) {
            if(localStorage.radDeg == "rad"){
                return Math.tan(x);
            }

            else{
                return Math.tan( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, "");
            }
        },

        asin : function(x) {
            if(localStorage.radDeg == "rad"){
                return Math.asin(x);
            }

            else{
                return Math.asin(x) * 180 / Math.PI;
            }
        },

        in : function(x) {
            return Math.log(x);
        },

        acos : function(x) {
            if(localStorage.radDeg == "rad"){
                return Math.acos(x);
            }

            else{
                return Math.acos(x) * 180 / Math.PI;
            }
        },

        atan : function(x) {
            if(localStorage.radDeg == "rad"){
                return Math.atan(x);
            }

            else{
                return Math.atan(x) * 180 / Math.PI;
            }
        },

        //other functions
        percentage : function(){
            if(calculator.op== ""){
                calculator.first = String(1 * (calculator.first * 0.01));
                calculator.clear = true;
                return calculator.first;
            }

            else{
                calculator.second = String(calculator.first * (calculator.second * 0.01));
                calculator.clear = true;
                return calculator.second;
            }
        }
    },

    math : function(fun, x, y){
        var result = calculator["mathFunctions"][fun](x,y);
        if(result != false) return calculator.screen.set(result);
        else calculator.screen.get();
    },

    event : {
        addDecimal : function() {
            if(calculator.clear == true){
                calculator.screen.clear();
            }

            if(calculator.screen.get().indexOf(".") == -1){
                if(calculator.op== ""){
                    calculator.first = calculator.first + ".";
                    calculator.screen.set(calculator.first);
                }

                else{
                    if(calculator.second = ".") calculator.second = "0.";
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
        }
    },

    //memory functions
    m : {
        recall : function() {
            if(parseFloat(localStorage.m) != 0){
                if(calculator.op== ""){
                    calculator.first = localStorage.m;
                    calculator.screen.set(calculator.first);
                }

                else{
                    calculator.second = localStorage.m;
                    calculator.screen.set(calculator.second);
                }
            }
            return false;
        },

        clear : function(){
            localStorage.m = 0;
            return false;
        },

        minus : function() {
            localStorage.m = parseFloat(localStorage.m) - parseFloat(calculator.screen.get());
            return false;
        },

        plus : function() {
            localStorage.m = parseFloat(localStorage.m) + parseFloat(calculator.screen.get());
            return false;
        }
    },

    parse : {
        commas : function(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    },

    animate : {
        op : function(){
            $(".opp").css({"-webkit-transform" : "scale(1)"}); //reset scale

            if(calculator.op != undefined){ //bounce shrink animation
                $("#" + calculator.op).css({"-webkit-transform" : "scale(0.90)"});
                setTimeout( function() {
                    $("#" + calculator.op).css({"-webkit-transform" : "scale(0.95)"});
                }, 100);
            }

            return;
        }
    },

    clipboard : {
        copy : function(text) {
            var copyFrom = $('<input/>');
            copyFrom.val(text);
            $('body').append(copyFrom);
            copyFrom.select();
            document.execCommand('copy');
            copyFrom.remove();
        }
    },

    paste : function() {
        var pasteTo = $('<input/>');
        $('body').append(pasteTo);
        pasteTo.select();
        document.execCommand('paste');
        var number = parseFloat(pasteTo.val());
        if(!isNaN(parseFloat(number)) && String(number) != "0"){
            calculator.screen.set(number);
            if(calculator.op== "") calculator.first = number;
            else calculator.second = number;
        }

        else{
            calculator.screen.selector.text("ERROR");
            calculator.screen.clear();
        }
        pasteTo.remove();
        return number;
    },

    rad : function() {
        $("#rad-deg").text("rad");
        return "rad";
    },

    deg : function() {
        $("#rad-deg").text("deg");
        return "deg";
    }
}

$(document).ready(function() {
    calculator.ini({
        selector : $("#input"),
        max : 15
    });
});
