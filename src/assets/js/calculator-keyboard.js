$(document).ready(() => {

    window.onkeydown = (e) => {
        let code = e.keyCode,
            key = e.key;


        let functions = {
            'c': 'clear',
            '=': 'calculate',
            13: 'calculate'
        }

        if(typeof calculator.functions[functions[key]] == 'function')
            calculator.functions[functions[key]]();

        else if(typeof calculator.functions[functions[code]] == 'function')
            calculator.functions[functions[code]]();



        // fix pi
        let subs = {
            'p': 'P',
            '*': 'x',
            'X': 'x'
        }
        if(typeof subs[key] !== 'undefined') key = subs[key];



        let permits = [
            /[0-9]/,
            '-',
            '+',
            '%',
            '^',
            'P',
            'x'
        ],
        permitted = false
        permits.forEach((permit) => {
            if(typeof permit == 'object')
                permitted = permit.test(key);

            else if(permit == code || permit == key)
                permitted = true;
        });


        if(permitted) calculator.screen.add(key);
    };
});
