$(document).ready(() => {

    let phrase = '';
    $(document).keydown((e) => {
        let code = e.keyCode,
            key = e.key;

        phrase = phrase.slice(-1) + key;


        // allow user to type trig functions
        let phrases = {
            'co': 'cos(',
            'si': 'sin(',
            'ta': 'tan(',
            'ln': 'ln(',
            'log': 'log2('
        };
        if(Object.keys(phrases).includes(phrase)){
            calculator.screen.add(phrases[phrase]);
            phrase = '';
            return false;
        }




        let functionCodes = {
            '8':       'clear',
            'shift-8': 'allClear',
            '13':      'calculate',
            '9':       'radDeg',
            '38':      'historyUp',
            '40':      'historyDown'
        }
        let fnName = `${e.shiftKey ? 'shift-' : ''}${code}`;
        if(calculator.functions[functionCodes[fnName]]){
            calculator.functions[functionCodes[fnName]]();
            return false;
        }


        let functionKeys = {
            '=': 'calculate'
        }
        if(calculator.functions[functionKeys[key]]){
            calculator.functions[functionKeys[key]]();
            return false;
        }



        // fix pi
        let subs = {
            'p': 'P',
            'E': 'e',
            '*': 'x',
            'X': 'x'
        }
        if(typeof subs[key] !== 'undefined') key = subs[key];



        let permits = [
            /[0-9]/,
            '-',
            '+',
            'x',
            '/',
            '%',
            '^',
            'P',
            'e',
            '!',
            '(', ')'
        ],
        permitted = false
        permits.forEach((permit) => {
            if(typeof permit == 'object')
                permitted = permit.test(key);

            else if(permit == code || permit == key)
                permitted = true;
        });


        if(permitted){
            calculator.screen.add(key);
            return false;
        }
    });
});
