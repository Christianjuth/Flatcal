$(document).ready(function() {
    window.onkeydown = function(e) {
        if(e.keyCode == 8){
            setTimeout(function() { //run async
                if(calculator.op == ""){
                    calculator.first = calculator.first.substring(0,calculator.first.length -1);
                    calculator.screen.set(calculator.first);
                }

                else{
                    calculator.second = calculator.second.substring(0,calculator.second.length -1);
                    calculator.screen.set(calculator.second);
                }

                if(calculator.clear == true || $('#input').text().length == 0){
                    calculator.screen.clear();
                }

                if(calculator.screen.get() == ""){
                    calculator.screen.set(0);
                }
            }, 0)
            return false; //dissable keyboard history back THIS IS A HACK
        }

        //if a number key is prssed trigger buttonClicked function
        else if (e.keyCode >= 48 && e.keyCode <= 57 && event.shiftKey == false) {
            calculator.numberClicked(e.keyCode - 48);
        }

        else if (e.keyCode >= 96 && e.keyCode <= 105 && event.shiftKey == false) {
            calculator.numberClicked(e.keyCode - 96);
        }

        //if point is clicked trigger point function
        else if(e.keyCode == 190 || e.keyCode == 110) {
            if(calculator.screen.length() < calculator.maxLength){
                calculator.event.addDecimal();
            }
        }

        else if(e.keyCode == 53 && event.shiftKey == true) {
            calculator.event.percentage();
        }

        //if plus is clicked trigger calculator.operator function with plus input
        else if((event.shiftKey == true && e.keyCode == 187) || e.keyCode == 107) {
            calculator.operator("plus");
        }

        //if minus is clicked trigger calculator.operator function with subtract input
        else if(event.shiftKey == false && (e.keyCode == 189 || e.keyCode == 109)){
            calculator.operator("subtract");
        }

        //if multiply is clicked trigger calculator.operator function with multiply input
        else if((event.shiftKey == true && e.keyCode == 56) || e.keyCode == 88 || e.keyCode == 106) {
            calculator.operator("multiply");
        }

        //if divide is clicked trigger calculator.operator function with devide input
        else if(e.keyCode == 191 || e.keyCode == 111) {
            calculator.operator("divide");
        }

        else if((e.keyCode == 67 && event.ctrlKey == false && event.metaKey == false) || e.keyCode == 12) {
            calculator.screen.clear();
        }

        //windows
        else if(e.keyCode == 67 && event.ctrlKey == true && window.navigator.platform.toLowerCase().indexOf("mac") == -1) {
            calculator.clipboard.copy(calculator.screen.get());
        }

        //mac
        else if(e.keyCode == 67 && event.metaKey == true) {
            calculator.clipboard.copy(calculator.screen.get());
        }

        //windows
        else if(e.keyCode == 86 && event.ctrlKey == true && window.navigator.platform.toLowerCase().indexOf("mac") == -1) {
            calculator.clipboard.paste();
        }

        //mac
        else if(e.keyCode == 86 && event.metaKey == true) {
            calculator.clipboard.paste();
        }

        //enter
        else if((event.shiftKey == false && e.keyCode == 187) || e.keyCode == 13 || e.keyCode == 187){
            calculator.calculate(true); //true if for the clear function
        }

        //if minus is clicked trigger calculator.operator function with subtract input
        else if(event.shiftKey == true && e.keyCode == 189){
            calculator.event.posNeg();
        }
    }
});
