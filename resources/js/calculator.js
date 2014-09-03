if(enable == undefined || enable == "undefined"){
    var enable = "all";
}

$(document).ready(function() {
    if(localStorage.radDeg == "rad") rad();
    else deg();

    //resets the calulator on load
    Clear();
});

//number pressed function triggered when any number on the calculator is pressed
function numberClicked(lastButtonClicked){
    //clears any previous values
    if(clear == true){
        Clear();
    }

    if(inputNumber() == "0" && lastButtonClicked == 0 && $("#input").text().indexOf(".") == -1){
        //keeps the user from entering more then one 0 withoug another number
    }

    else if(opp == ""){
        if(String(first).replace(/-/,"").replace(/\./,"").length < Math.min(Math.round(($("#input-container").width() / 18) - 1), 16)){
            first = first + lastButtonClicked;
            inputNumber(first, false);
        }
    }

    else{
        if(String(second).replace(/-/,"").replace(/\./,"").length < Math.min(Math.round(($("#input-container").width() / 18) - 1), 16)){
            if(second == "0"){
                second = "";
            }

            second = second + lastButtonClicked;
            inputNumber(second, false);
        }
    }

    return;
}

//decimal function when the decemel button is clicked it adds a decimal to the given number
function addDecimal() {
    if(clear == true){
        Clear();
    }

    if(String(inputNumber()).indexOf(".") == -1){
        if(opp == ""){
            first = inputNumber() + ".";
            inputNumber(first);
        }

        else{
            second = inputNumber() + ".";
            inputNumber(second);
        }
    }

    return;
}

//positive negative function
function posNeg() {
    if(opp == ""){
        first = first * -1;
        inputNumber(first);
    }

    if(opp != ""){
        second = second * -1;
        inputNumber(second);
    }

    return;
}

//opp clicked function
function oppClicked(opperator) {
    if(opp != ""){
        clear = false;
        calculate(false); //false if for the clear function which will only be triggered if the paramiter is true
        opp = opperator;
        animateOpp(opperator);
    }

    else if(first != ""){
        clear = false;
        calculate(false); //false if for the clear function which will only be triggered if the paramiter is true
        opp = opperator;
        animateOpp(opperator);
    }

    else if(first == ""){
        first = 0;
        clear = false;
        opp = opperator;
        calculate(false); //false if for the clear function which will only be triggered if the paramiter is true
        animateOpp(opperator);
    }

    return opperator;
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

//calculate function
function calculate(clearVaulesAfter){
    var finalNumber = new Array();
    var output = "";

    if(second != ""){
        if(opp == "plus"){
            overall = parseFloat(first) + parseFloat(second); //addition
        }

        else if(opp == "subtract"){
            overall = parseFloat(first) - parseFloat(second); //subtraction
        }

        else if(opp == "multiply"){
            overall = parseFloat(first) * parseFloat(second); //multiplication
        }

        else if(opp == "divide"){
            overall = parseFloat(first) / parseFloat(second); //divition
        }

        else if(opp == "mod"){
            overall = parseFloat(first) % parseFloat(second); //mod
        }

        else if(opp == "pow-of-y"){
            overall = Math.pow(parseFloat(first), parseFloat(second));
        }

        else if(opp == "square-root-y"){
            overall = Math.nthroot(parseFloat(first), parseFloat(second));
        }

        inputNumber(overall);

        first = overall;
        second = "";
        overall = "";

        if(clearVaulesAfter == true){
            clear = true;
        }
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

function Clear(){
    animateOpp();
    clear = false;
    first = "";
    second = "";
    opp = "";
    overall = "";
    inputNumber(0);
    return;
}

function pi() {
    var pi = "3.141592653589793";
    if(opp == ""){
        first = inputNumber(pi);
    }

    else{
        second = inputNumber(pi);
    }
    return;
}

function thePowerOf(x) {
    first = Math.pow(parseFloat($('#input').text()), x);
    inputNumber(first);
    return;
}

//square root number
function squareRoot(x) {
    first = Math.sqrt(x);
    $('#input').text(first);
    return;
}

//sin
function sin(x) {
    Clear();

    if(localStorage.radDeg == "rad"){
        inputNumber(Math.sin(x));
    }

    else{
        inputNumber(Math.sin( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, ""));
    }
    return;
}

//cos
function cos(x) {
    Clear();
    if(localStorage.radDeg == "rad"){
        inputNumber(Math.cos(x));
    }

    else{
        inputNumber(Math.cos( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, ""));
    }
    return;
}

function tan(x) {
    if(localStorage.radDeg == "rad"){
        inputNumber(Math.tan(x));
    }

    else{
        inputNumber(Math.tan( x * Math.PI / 180 ).toFixed(15).replace(/\.?0+$/, ""));
    }
}

//sin
function asin(x) {
    Clear();

    if(localStorage.radDeg == "rad"){
        inputNumber(Math.asin(x));
    }

    else{
        inputNumber(Math.asin(x) * 180 / Math.PI);
    }
    return;
}

//cos
function acos(x) {
    Clear();

    if(localStorage.radDeg == "rad"){
        inputNumber(Math.acos(x));
    }

    else{
        inputNumber(Math.acos(x) * 180 / Math.PI);
    }
    return;
}

//angle tan
function atan(x) {
    if(localStorage.radDeg == "rad"){
        inputNumber(Math.atan(x));
    }

    else{
        inputNumber(Math.atan(x) * 180 / Math.PI);
    }
}

//e
function e() {
    Clear();
    inputNumber(Math.E);
    return;
}

//in
function In(x) {
    Clear();
    inputNumber(Math.log(x));
    return;
}

//log
function log(x) {
    Clear();
    inputNumber(Math.log(x) / Math.log(10));
    return;
}

//memory
function mPlus() {
    localStorage.m = parseFloat(localStorage.m) + parseFloat(inputNumber());
    return;
}

function mMinus() {
    localStorage.m = parseFloat(localStorage.m) - parseFloat(inputNumber());
    return;
}

function mClear() {
    localStorage.m = 0;
    return;
}

function mRecall() {
    if(parseFloat(localStorage.m) != 0){
        if(opp == ""){
            first = localStorage.m;
            inputNumber(first);
        }

        else{
            second = localStorage.m;
            inputNumber(second);
        }
    }
    return localStorage.m;
}

function inputNumber(originalNumber, stripZeros) {
    if(stripZeros == undefined || stripZeros == "undefined") stripZeros = true;
    var originalNumber = String(originalNumber);
    var number = "";

    if(originalNumber != "" && originalNumber != undefined && originalNumber != "undefined"){
        var maxLength = Math.min(Math.round(($("#input-container").width() / 18) - 1), 16);

        //split overall so we can work with the desemel and whole number separately
        var finalNumber = originalNumber.split('.');

        if(String(finalNumber[0]).replace(/-/,"").replace(/\./,"").length > maxLength || !isNaN(parseFloat(originalNumber)) != true){
            Clear();
            $("#input").text("ERROR");
            console.error("number too long");
        }

        else if(finalNumber.length == 2) {

            if(String(finalNumber[1]).replace(/-/,"").replace(/\./,"").length >= (maxLength - String(finalNumber[0]).replace(/-/,"").replace(/\./,"").length)) {
                finalNumber[1] = finalNumber[1].substring(0, maxLength - finalNumber[0].length);

                if(stripZeros == true){
                    for(var i = 0; i < 20; i++){
                        if(finalNumber[1].substring(finalNumber[1].length - 1, finalNumber[1].length) == 0){
                            finalNumber[1] = finalNumber[1].substring(0, finalNumber[1].length - 1);
                        }
                    }
                }

                number = finalNumber[0] + "." + finalNumber[1];
            }

            else{
                if(finalNumber[1] != ""){
                    //                    makes sure decemel doesn't end with a 0
                    if(stripZeros == true){
                        for(var i = 0; i < 20; i++){
                            if(finalNumber[1].substring(finalNumber[1].length - 1, finalNumber[1].length) == 0){
                                finalNumber[1] = finalNumber[1].substring(0, finalNumber[1].length - 1);
                            }
                        }
                    }

                    number = finalNumber[0] + "." + finalNumber[1];
                }

                else{
                    number = finalNumber[0];
                }
            }

            if(originalNumber.indexOf(".") != - 1 && number.indexOf(".") == -1){
                number = number + ".";
            }

            $("#input").text(numberCommas(number));
        }

        else{

            if(originalNumber.indexOf(".") != - 1 && number.indexOf(".") == -1){
                number = number + ".";
            }

            $("#input").text(numberCommas(finalNumber[0]));
        }
    }

    return $("#input").text().replace(/,/,"");
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
        inputNumber(number);
        if(opp == "") first = number;
        else second = number;
    }

    else{
        $("#input").text("ERROR");
        Clear();
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
