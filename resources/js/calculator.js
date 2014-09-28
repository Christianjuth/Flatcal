if(enable == undefined || enable == "undefined"){
    var enable = "all";
}

$(document).ready(function() {
    calculator.maxLength = Math.min(Math.round(($("#input-container").width() / 18) - 1), 15);
    if(localStorage.radDeg == "rad") rad();
    else deg();

    calculator.screen.clear(); //resets the calulator on load
});

var calculator = {
    numberClicked : function(lastButtonClicked){
        var decimal = this.first.indexOf(".") != -1;
        if(clear == true) calculator.screen.clear(); //calculator.screen.clears any previous values
        var validate = calculator.screen.get() == "0" && lastButtonClicked == 0 && $("#input").text().indexOf(".") == -1;

        if(opp == "" && validate != true){
            if(calculator.first.replace(/-/g,"").replace(/\./g,"").length < calculator.maxLength){
                if(decimal) this.first = String(parseInt(this.first.split(".")[0]) + "." + this.first.split(".")[1] + lastButtonClicked);
                else this.first = String(parseInt(this.first) + "" + lastButtonClicked);
                this.screen.set(this.first, false);
            }
        }
        else if(validate != true){
            if(calculator.second.replace(/-/g,"").replace(/\./g,"").length < calculator.maxLength){
                if(decimal) this.second = String(parseInt(this.second.split(".")[0]) + "." + this.second.split(".")[1] + lastButtonClicked);
                else this.second = String(parseInt(this.second) + "" + lastButtonClicked);
                this.screen.set(this.second, false);
            }
        }

        return lastButtonClicked;
    },

    screen : {
        set : function(number, stripZeros) {
            number = String(number);
            if(number.indexOf(".") != -1) number = String(parseInt(number.split(".")[0]) + "." + number.split(".")[1]);
            else number = String(parseInt(number));
            var valid = (number != "" && number != undefined && number != "undefined"); //validate number
            if(number.split(".")[0].length > calculator.maxLength || !valid){
                this.clear();
                $("#input").text("ERROR");
                return false;
            }

            if(number.length <= calculator.maxLength && valid){
                $("#input").text(numberCommas(number));
            }

            else if(number.split(".")[0].length < calculator.maxLength && valid){
                $("#input").text(math.round(parseFloat(number), calculator.maxLength - number.split(".")[0].length));
            }

            return $("#input").text().replace(/,/g,"");
        },

        get: function(){
            return $("#input").text().replace(/,/g,"");
        },

        length: function(){
            return this.get().replace(/\./g,"").length;
        },

        clear: function(){
            animateOpp();
            clear = false;
            calculator.first = "0";
            calculator.second = "";
            opp = "";
            overall = "";
            calculator.screen.set(0);
            return;
        }
    },

    opp: function(opperator) {
        if(opperator == undefined) opperator = "";
        if(opp != ""){
            calculator.calculate(false);
            clear = false;
            opp = opperator;
            animateOpp(opperator);
        }

        else{
            clear = false;
            opp = opperator;
            animateOpp(opperator);
        }

        return opp;
    },

    calculate: function(clearVaulesAfter){
        var finalNumber = new Array();
        var output = "";

        if(calculator.second != ""){
            if(opp == "plus"){
                overall = parseFloat(calculator.first) + parseFloat(calculator.second); //addition
            }

            else if(opp == "subtract"){
                overall = parseFloat(calculator.first) - parseFloat(calculator.second); //subtraction
            }

            else if(opp == "multiply"){
                overall = parseFloat(calculator.first) * parseFloat(calculator.second); //multiplication
            }

            else if(opp == "divide"){
                overall = parseFloat(calculator.first) / parseFloat(calculator.second); //divition
            }

            else if(opp == "mod"){
                overall = parseFloat(calculator.first) % parseFloat(calculator.second); //mod
            }

            else if(opp == "pow-of-y"){
                overall = Math.pow(parseFloat(calculator.first), parseFloat(calculator.second));
            }

            else if(opp == "square-root-y"){
                overall = Math.nthroot(parseFloat(calculator.first), parseFloat(calculator.second));
            }

            $("#input").text("");
            setTimeout(calculator.screen.set, 100, overall);

            calculator.first = String(overall);
            calculator.second = "0";
            overall = "";

            if(clearVaulesAfter == true){
                clear = true;
            }
        }

        return;
    },

    math:{
        pi : function() {
            var pi = "3.141592653589793";
            if(opp == ""){
                calculator.first = calculator.screen.set(pi);
            }

            else{
                calculator.second = calculator.screen.set(pi);
            }
            return;
        },

        thePowerOf : function(x) {
            calculator.first = Math.pow(parseFloat($('#input').text()), x);
            calculator.screen.set(calculator.first);
            return;
        }
    }
}

//decimal function when the decemel button is clicked it adds a decimal to the given number
function addDecimal() {
    if(clear == true){
        calculator.screen.clear();
    }

    if(String(calculator.screen.set()).indexOf(".") == -1){
        if(opp == ""){
            calculator.first = calculator.first + ".";
            calculator.screen.set(calculator.first);
        }

        else{
            calculator.second = calculator.second + ".";
            calculator.screen.set(calculator.second);
        }
    }

    return;
}

//positive negative function
function posNeg() {
    if(opp == ""){
        if(calculator.first.length == 0) calculator.first = "-0";
        else if(calculator.first.indexOf("-") == -1) calculator.first = "-" + calculator.first;
        else calculator.first = calculator.first.replace(/-/g,"");
        calculator.screen.set(calculator.first);
    }

    if(opp != ""){
        if(calculator.second.length == 0) calculator.second = "-0";
        else if(calculator.second.indexOf("-") == -1) calculator.second = "-" + calculator.second;
        else calculator.second = calculator.second.replace(/-/g,"");
        calculator.screen.set(calculator.second);
    }

    return;
}

function animateOpp(opperator) {
    $(".opp").css({"-webkit-transform" : "scale(1)"}); //reset scale

    if(opperator != undefined){ //bounce shrink animation
        $("#" + opperator).css({"-webkit-transform" : "scale(0.90)"});
        setTimeout( function() {
            $("#" + opperator).css({"-webkit-transform" : "scale(0.95)"});
        }, 100);
    }

    return;
}

Math.nthroot = function(x, n) {
    try {
        var negate = n % 2 == 1 && x < 0;
        if(negate)
            x = -x;
        var possible = Math.pow(x, 1 / n);
        n = Math.pow(possible, n);
        if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
            return negate ? -possible : possible;
    } catch(e){}
}

//square root number
function squareRoot(x) {
    calculator.first = Math.sqrt(x);
    $('#input').text(calculator.first);
    return;
}

//sin
function sin(x) {
    calculator.screen.clear();

    if(localStorage.radDeg == "rad"){
        calculator.screen.set(Math.sin(x));
    }

    else{
        calculator.screen.set(Math.sin( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, ""));
    }
    return;
}

//cos
function cos(x) {
    calculator.screen.clear();
    if(localStorage.radDeg == "rad"){
        calculator.screen.set(Math.cos(x));
    }

    else{
        calculator.screen.set(Math.cos( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, ""));
    }
    return;
}

function tan(x) {
    if(localStorage.radDeg == "rad"){
        calculator.screen.set(Math.tan(x));
    }

    else{
        calculator.screen.set(Math.tan( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, ""));
    }
}

//sin
function asin(x) {
    calculator.screen.clear();

    if(localStorage.radDeg == "rad"){
        calculator.screen.set(Math.asin(x));
    }

    else{
        calculator.screen.set(Math.asin(x) * 180 / Math.PI);
    }
    return;
}

//cos
function acos(x) {
    calculator.screen.clear();

    if(localStorage.radDeg == "rad"){
        calculator.screen.set(Math.acos(x));
    }

    else{
        calculator.screen.set(Math.acos(x) * 180 / Math.PI);
    }
    return;
}

//angle tan
function atan(x) {
    if(localStorage.radDeg == "rad"){
        calculator.screen.set(Math.atan(x));
    }

    else{
        calculator.screen.set(Math.atan(x) * 180 / Math.PI);
    }
}

//e
function e() {
    calculator.screen.clear();
    calculator.screen.set(Math.E);
    return;
}

//in
function In(x) {
    calculator.screen.clear();
    calculator.screen.set(Math.log(x));
    return;
}

//log
function log(x) {
    calculator.screen.clear();
    calculator.screen.set(Math.log(x) / Math.log(10));
    return;
}

//memory
function mPlus() {
    localStorage.m = parseFloat(localStorage.m) + parseFloat(calculator.screen.set());
    return;
}

function mMinus() {
    localStorage.m = parseFloat(localStorage.m) - parseFloat(calculator.screen.set());
    return;
}

function mClear(){
    localStorage.m = 0;
    return;
}

function mRecall() {
    if(parseFloat(localStorage.m) != 0){
        if(opp == ""){
            calculator.first = localStorage.m;
            calculator.screen.set(calculator.first);
        }

        else{
            calculator.second = localStorage.m;
            calculator.screen.set(calculator.second);
        }
    }
    return localStorage.m;
}

function numberCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function copy(text) {
    var copyFrom = $('<input/>');
    copyFrom.val(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}

function paste() {
    var pasteTo = $('<input/>');
    $('body').append(pasteTo);
    pasteTo.select();
    document.execCommand('paste');
    var number = parseFloat(pasteTo.val());
    if(!isNaN(parseFloat(number)) && String(number) != "0"){
        calculator.screen.set(number);
        if(opp == "") calculator.first = number;
        else calculator.second = number;
    }

    else{
        $("#input").text("ERROR");
        calculator.screen.clear();
    }
    pasteTo.remove();
    return number;
}

function rad() {
    $("#rad-deg").text("rad");
    return "rad";
}

function deg() {
    $("#rad-deg").text("deg");
    return "deg";
}
