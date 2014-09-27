$(document).ready(function() {
    //even listeners
    $("#rad-deg").mousedown(function () {
        if($("#rad-deg").text() == "rad"){
            localStorage.radDeg = deg();
        }

        else if($("#rad-deg").text() == "deg"){
            localStorage.radDeg = rad();
        }
    });

    //calculator buttons------------------------------->

    //numbers
    $(".number").mousedown(function() {
        if($(this).attr("value") >= 0 && $(this).attr("value") <= 9){
            if(enable.indexOf("number") != -1 || enable == "all" || enable == undefined){
                calculator.numberClicked($(this).attr("value"));
            }
        }
    });

    //point
    $("#point").mousedown(function() {
        if(enable.indexOf("point") != -1 || enable == "all" || enable == undefined){
            if($("#input").text().length < 16 && localStorage.scientific == "true" && localStorage.screenOnly == "false"){
                addDecimal();
            }

            else if($("#input").text().length < Math.min(Math.round(($("#input-container").width() / 17) - 1), 16)) {
                addDecimal();
            }
        }
    });

    //posNeg clicked
    $("#positive-negative").mousedown(function() {
        if(enable.indexOf("pos-neg") != -1 || enable == "all" || enable == undefined){
            posNeg();
        }
    });

    $(".opp").mousedown(function() {
        if(enable.indexOf("opp") != -1 || enable == "all" || enable == undefined){
            calculator.opp($(this).attr("value"));
        }
    });

    //equal clicked
    $("#equal").mousedown(function() {
        if(enable.indexOf("equal") != -1 || enable == "all" || enable == undefined){
            calculator.calculate(true); //true if for the clear function
        }
    });

    //ce button
    $("#ce").mousedown(function() {
        if(enable.indexOf("ce") != -1 || enable == "all" || enable == undefined){
            calculator.screen.clear();
        }
    });

    //pi button
    $("#pi").mousedown(function() {
        if(enable == "all" || enable == undefined){
            pi();
        }
    });

    //to the power of button
    $(".the-power-of").mousedown(function() {
        if(enable == "all" || enable == undefined){
            thePowerOf($(this).attr("value"));
        }
    });

    //to the power of button
    $("#square-root").mousedown(function() {
        if(enable == "all" || enable == undefined){
            squareRoot($("#input").text());
        }
    });

    //sin button
    $("#sin").mousedown(function() {
        if(enable == "all" || enable == undefined){
            sin($("#input").text());
        }
    });

    //tan button
    $("#tan").mousedown(function() {
        if(enable == "all" || enable == undefined){
            tan($("#input").text());
        }
    });

    //cos button
    $("#cos").mousedown(function() {
        if(enable == "all" || enable == undefined){
            cos($("#input").text());
        }
    });

    //asin button
    $("#asin").mousedown(function() {
        if(enable == "all" || enable == undefined){
            asin($("#input").text());
        }
    });

    //atan button
    $("#atan").mousedown(function() {
        if(enable == "all" || enable == undefined){
            atan($("#input").text());
        }
    });

    //acos button
    $("#acos").mousedown(function() {
        if(enable == "all" || enable == undefined){
            acos($("#input").text());
        }
    });

    //e button
    $("#e").mousedown(function() {
        if(enable == "all" || enable == undefined){
            e();
        }
    });

    //log button
    $("#log").mousedown(function() {
        if(enable == "all" || enable == undefined){
            log($("#input").text());
        }
    });

    //in button
    $("#in").mousedown(function() {
        if(enable == "all" || enable == undefined){
            In($("#input").text());
        }
    });

    //m clear
    $("#m-clear").mousedown(function() {
        if(enable == "all" || enable == undefined){
            mClear();
        }
    });

    //m plus
    $("#m-plus").mousedown(function() {
        if(enable == "all" || enable == undefined){
            mPlus();
        }
    });

    //m minus
    $("#m-minus").mousedown(function() {
        if(enable == "all" || enable == undefined){
            mMinus();
        }
    });

    //m recall
    $("#m-recall").mousedown(function() {
        if(enable == "all" || enable == undefined){
            mRecall();
        }
    });

    $("#copy").click(function() {
        copy($("#input").text());
    });

    $("#paste").click(function() {
        paste($("#input").text());
    });

    $("#x10").mousedown(function() {
        if(enable == "all" || enable == undefined){
            timesTen($("#input").text());
        }
    });
});
