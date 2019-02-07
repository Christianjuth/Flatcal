chrome.windows.getCurrent(function(x){
    if(x.type == "normal" && localStorage.type == "popout"){
        chrome.windows.create({
            url:chrome.extension.getURL('index.html'),
            type:"popup",
            focused:true,
            width:441,
            height:298
        });
        window.close();
    }

    else{
        chrome.browserAction.onClicked.addListener(() => {
            window.close();
        });
    }
});

if(localStorage.type == "screen-only"){
    $("html,body").css({"width": 300, "height": 73});
}

else if(localStorage.type == "normal"){
    $("html,body").css({"width": 222, "height": 286});
}

else{
    $("html,body").css({"width": 434, "height": 303});
}

$(document).ready(function() {
    if(localStorage.dev != "true"){ //track button presses
        var buttons = $(".button");
        for (var i = 0; i < buttons.length; i   ++) {
            buttons[i].addEventListener('click', trackButton);
        }
    }

    if(localStorage.type == "screen-only"){
        $('.calculator').addClass('screenOnly');
        $("#scientific-1").remove();
        $("#scientific-2").remove();
    }

    else if(localStorage.type == "normal"){
        $("#scientific-1").remove();
        $("#scientific-2").remove();
        $("#number-container").css({"display":"inline-block"});
        $("#input").css({"width":"100%"});
        $("#input-container > .text").hide();
    }

    else{
        $('.calculator').addClass('scientific');
        $("#scientific-1").css({"display":"inline-block"});
        $("#number-container").css({"display":"inline-block"});
    }

    if(localStorage.theme !== 'custom'){
        theme.load(localStorage.theme);
    }

    else{
        try{
            theme.load('custom');
        } catch(e){
            theme.load('google');
        }
    }
});



$(document).ready(() => {
    window.calculator = new Calculator({
        storage:      localStorage,
        screenWrap:   $(".input-wrap"),
        screen:       $(".input"),
        screenBefore: $(".input-before"),
        screenAfter:  $(".input-after"),
        radDeg:       $("#rad-deg")
    });

    $('body').on('click', '.button[value]', function() {
        let value = $(this).attr('value');
        calculator.add(value);
    });

    $('body').on('click', '.button[fun]', function() {
        let fun = $(this).attr('fun');
        calculator[fun]();
    });

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
                'l2': 'log2(',
                'an': 'Ans',
                'rt': 'rt',
                'ro': 'rt',
                'sq': 'sqrt('
            };
            if(Object.keys(phrases).includes(phrase)){
                let add = phrases[phrase];
                phrase = '';
                calculator.add(add);
                return false;
            }
        }


        let functionCodes = {
            '8':        'clear',
            'shift-8':  'allClear',
            '13':       'calculate',
            '9':        'radDeg',
            '38':       'historyUp',
            '40':       'historyDown',
            'ctrl-86':  'paste',
            'ctrl-67':  'copy'
        };
        let fnName = `${e.shiftKey ? 'shift-' : ''}${code}`;
        fnName = `${e.metaKey||e.ctrlKey ? 'ctrl-' : ''}${fnName}`;


        if(calculator[functionCodes[fnName]]){
            calculator[functionCodes[fnName]]();
            return false;
        }


        let functionKeys = {
            '=': 'calculate'
        };
        if(calculator[functionKeys[key]]){
            calculator[functionKeys[key]]();
            return false;
        }


        // fix pi
        let subs = {
            'p': 'P',
            'E': 'e',
            'x': '*',
            'X': '*'
        };
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
            '(', ')',
            '.'
        ],
        permitted = false;
        permits.forEach((permit) => {
            if(typeof permit == 'object')
                permitted = permit.test(key);

            else if(permit == code || permit == key)
                permitted = true;
        });


        if(permitted){
            calculator.add(key);
            return false;
        }
    });
});
