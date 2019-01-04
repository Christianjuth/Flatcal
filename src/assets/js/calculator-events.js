$(document).ready(function() {
    // //ce button
    // $("#ce").mousedown(function() {
    //     calculator.screen.clear();
    // });

    // //even listeners
    // $("#rad-deg").mousedown(function () {
    //     calculator.event.radDeg();
    // });

    // $(".math").mousedown(function() {
    //     var x = "";
    //     var y = "";
    //     if($(this).attr("x") != undefined) x = $(this).attr("x");
    //     else x = calculator.screen.get();
    //     if($(this).attr("y") != undefined) y = $(this).attr("y");
    //     calculator.math($(this).attr("fun"), x, y);
    // });

    // $(".m").mousedown(function() {
    //     calculator["m"][$(this).attr("fun")]();
    // });

    // $(".number").mousedown(function() {
    //     if($(this).attr("value") >= 0 && $(this).attr("value") <= 9){
    //         calculator.numberClicked($(this).attr("value"));
    //     }
    // });

    // $(".opp").mousedown(function() {
    //     calculator.operator($(this).attr("value"));
    // });

    // $(".event").mousedown(function() {
    //     calculator.event[$(this).attr("fun")]();
    // });

    // //point
    // $("#point").mousedown(function() {
    //     if(calculator.screen.length() < calculator.maxLength){
    //         calculator.event.addDecimal();
    //     }
    // });

    // //posNeg clicked
    // $("#positive-negative").mousedown(function() {
    //     calculator.event.posNeg();
    // });

    // //equal clicked
    // $("#equal").mousedown(function() {
    //     calculator.calculate(true); //true if for the clear function
    // });

    // calculator.section = 1;
    // $(".2x").click(function() {
    //     if(calculator.section == 1){
    //         $("#scientific-1").hide();
    //         $("#scientific-2").show();
    //         calculator.section = 2;
    //     }

    //     else{
    //         $("#scientific-2").hide();
    //         $("#scientific-1").show();
    //         calculator.section = 1;
    //     }
    // });

    $('.button[value]').click(function() {
        let value = $(this).attr('value');
        calculator.screen.add(value);
    });

    $('.button[fun]').click(function() {
        let fun = $(this).attr('fun');
        calculator.functions[fun]();
    });
});
