$(document).ready(function() {
    window.onkeydown = function(e) {
        let ctrl = (event.ctrlKey == true || event.metaKey == true),
            shift = event.shiftKey,
            key = e.keyCode;

        if(key == 8){
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
        else if (key >= 48 && key <= 57 && !shift) {
            calculator.numberClicked(e.keyCode - 48);
        }




        else if (key >= 96 && key <= 105 && !shift) {
            calculator.numberClicked(e.keyCode - 96);
        }




        //if point is clicked trigger point function
        else if(key == 190 || key == 110) {
            if(calculator.screen.length() < calculator.maxLength){
                calculator.event.addDecimal();
            }
        }




        else if(key == 53 && shift) {
            calculator.event.percentage();
        }




        else if(key == 54 && shift) {
            calculator.operator("pow-of-y");
        }




        //if plus is clicked trigger calculator.operator function with plus input
        else if((shift && key == 187) || key == 107) {
            calculator.operator("plus");
        }




        //if minus is clicked trigger calculator.operator function with subtract input
        else if(!shift && (key == 189 || key == 109)){
            calculator.operator("subtract");
        }




        //if multiply is clicked trigger calculator.operator function with multiply input
        else if((shift && key == 56) || key == 88 || key == 106) {
            calculator.operator("multiply");
        }




        //if divide is clicked trigger calculator.operator function with devide input
        else if(key == 191 || key == 111) {
            calculator.operator("divide");
        }




        else if((!ctrl && key == 67) || key == 12) {
            calculator.screen.clear();
        }





        // ctrl-c copy from screen
        else if(ctrl && key == 67) {
            calculator.clipboard.copy(calculator.screen.get());
        }





        // ctrl-v paste to screen
        else if(ctrl && key == 86) {
            calculator.clipboard.paste();
        }




        //enter
        else if((!shift && key == 187) || key == 13 || key == 187){
            calculator.calculate(true); //true if for the clear function
        }




        // minus key with shift toggles
        // positive negative number
        else if(shift && key == 189){
            calculator.event.posNeg();
        }
    }
});
