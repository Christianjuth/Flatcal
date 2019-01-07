$(document).ready(() => {

    let phrase = '';
    $(document).keydown((e) => {
        let code = e.keyCode,
            key = e.key;

        if(key.length == 1){
            phrase = phrase.slice(-1) + key.toLowerCase();

            // allow user to type trig functions
            let phrases = {
                'co': 'cos(',
                'ac': 'acos(',
                'si': 'sin(',
                'as': 'asin(',
                'ta': 'tan(',
                'at': 'atan(',
                'ln': 'ln(',
                'lo': 'log10(',
                'an': 'Ans',
                'rt': 'rt',
                'ro': 'rt',
                'sq': 'sqrt('
            };
            if(Object.keys(phrases).includes(phrase)){
                let add = phrases[phrase];
                phrase = '';
                calculator.screen.add(add);
                return false;
            }
        }



        let functionCodes = {
            '8':       'clear',
            'shift-8': 'allClear',
            '13':      'calculate',
            '9':       'radDeg',
            '38':      'historyUp',
            '40':      'historyDown',
            'ctrl-86':  'paste',
            'ctrl-67':  'copy'
        }
        let fnName = `${e.shiftKey ? 'shift-' : ''}${code}`;
        fnName = `${e.metaKey||e.ctrlKey ? 'ctrl-' : ''}${fnName}`;


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
            'x': '*',
            'X': '*'
        }
        if(typeof subs[key] !== 'undefined') key = subs[key];



        let permits = [
            /[0-9]/,
            '-',
            '+',
            '*',
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
