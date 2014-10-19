$(document).ready(function() {
    //ce button
    $("#ce").mousedown(function() {
        calculator.screen.clear();
    });

    //even listeners
    $("#rad-deg").mousedown(function () {
        if($("#rad-deg").text() == "rad"){
            localStorage.radDeg = calculator.deg();
        }

        else if($("#rad-deg").text() == "deg"){
            localStorage.radDeg = calculator.rad();
        }
    });

    $(".math").mousedown(function() {
        var x = "";
        var y = "";
        if($(this).attr("x") != undefined) x = $(this).attr("x");
        else x = calculator.screen.get();
        if($(this).attr("y") != undefined) y = $(this).attr("y");
        calculator.math($(this).attr("fun"), x, y);
    });

    $(".m").mousedown(function() {
        calculator["m"][$(this).attr("fun")]();
    });

    $(".number").mousedown(function() {
        if($(this).attr("value") >= 0 && $(this).attr("value") <= 9){
            calculator.numberClicked($(this).attr("value"));
        }
    });

    $(".opp").mousedown(function() {
        calculator.operator($(this).attr("value"));
    });

    //point
    $("#point").mousedown(function() {
        if(calculator.screen.length() < calculator.maxLength){
            calculator.event.addDecimal();
        }
    });

    //posNeg clicked
    $("#positive-negative").mousedown(function() {
        calculator.event.posNeg();
    });

    //equal clicked
    $("#equal").mousedown(function() {
        calculator.calculate(true); //true if for the clear function
    });
});
