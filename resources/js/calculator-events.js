$(document).ready(function() {
    //ce button
    $("#ce").mousedown(function() {
        calculator.screen.clear();
    });

    //even listeners
    $("#rad-deg").mousedown(function () {
        if($("#rad-deg").text() == "rad"){
            localStorage.radDeg = deg();
        }

        else if($("#rad-deg").text() == "deg"){
            localStorage.radDeg = rad();
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
        calculator.opp($(this).attr("value"));
    });

    //calculator buttons------------------------------->

    //point
    $("#point").mousedown(function() {
        if($("#input").text().length < calculator.maxLength){
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

    //sin button
    $("#sin").mousedown(function() {
        calculator.math("sin", $("#input").text());
    });

    //atan button
    $("#atan").mousedown(function() {
        atan($("#input").text());
    });

    //acos button
    $("#acos").mousedown(function() {
        acos($("#input").text());
    });

    $("#copy").click(function() {
        copy($("#input").text());
    });

    $("#paste").click(function() {
        paste($("#input").text());
    });

    $("#x10").mousedown(function() {
        timesTen($("#input").text());
    });
});
