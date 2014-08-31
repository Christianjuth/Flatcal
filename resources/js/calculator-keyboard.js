$(document).ready(function() {

    //keybord shortcuts----------------------------------->
    window.onkeydown = function(e) {
        //if a number key is prssed trigger buttonClicked function
        if (e.keyCode >= 48 && e.keyCode <= 57 && event.shiftKey == false) {
            numberClicked(e.keyCode - 48);
        }

        if (e.keyCode >= 96 && e.keyCode <= 105 && event.shiftKey == false) {
            numberClicked(e.keyCode - 96);
        }

        //if point is clicked trigger point function
        else if(e.keyCode == 190 || e.keyCode == 110) {
            if($("#input").text().length < 16 && localStorage.scientific == "true" && localStorage.screenOnly == "false"){
                addDecimal();
            }

            else if($("#input").text().length < 10) {
                addDecimal();
            }
        }

        //if plus is clicked trigger oppClicked function with plus input
        else if((event.shiftKey == true && e.keyCode == 187) || e.keyCode == 107) {
            oppClicked("plus");
        }

        //if minus is clicked trigger oppClicked function with subtract input
        else if(event.shiftKey == false && (e.keyCode == 189) || e.keyCode == 109)){
            oppClicked("subtract");
        }

        //if multiply is clicked trigger oppClicked function with multiply input
        else if((event.shiftKey == true && e.keyCode == 56) || e.keyCode == 88 || e.keyCode == 106) {
            oppClicked("multiply");
        }

        //if divide is clicked trigger oppClicked function with devide input
        else if(e.keyCode == 191 || e.keyCode == 111) {
            oppClicked("divide");
        }

        //backspace
        else if(e.keyCode == 8) {
            if(clear == true || $('#input').text().length == 1){
                Clear();
            }

            else if(opp == ""){
                first = first.substring(0,first.length -1);
                inputNumber(first);
            }

            else{
                second = second.substring(0,second.length -1);
                inputNumber(second);
            }

            if(inputNumber() == ""){
                inputNumber(0);
            }
        }

        else if((e.keyCode == 67 && event.ctrlKey == false && event.metaKey == false) || e.keyCode == 12) {
            Clear();
        }

        //windows
        else if(e.keyCode == 67 && event.ctrlKey == true && window.navigator.platform.toLowerCase().indexOf("mac") == -1) {
            copy(inputNumber());
        }

        //mac
        else if(e.keyCode == 67 && event.metaKey == true == true) {
            copy(inputNumber());
        }

        //windows
        else if(e.keyCode == 86 && event.ctrlKey == true && window.navigator.platform.toLowerCase().indexOf("mac") == -1) {
            paste();
        }

        //mac
        else if(e.keyCode == 86 && event.metaKey == true == true) {
            paste();
        }

        //enter
        else if((event.shiftKey == false && e.keyCode == 187) || e.keyCode == 13 || e.keyCode == 187){
            calculate(true); //true if for the clear function
        }

        //if minus is clicked trigger oppClicked function with subtract input
        else if(event.shiftKey == true && e.keyCode == 189){
            posNeg();
        }
    }
});
