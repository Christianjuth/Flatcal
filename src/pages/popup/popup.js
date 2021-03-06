$(document).ready(() => {
    $(".popout").click(() => {
        let h = $('.calculator').outerHeight()
            w = $('.calculator').outerWidth()
            l = window.screen.width - w - 150;

        let child = window.open(location.href,'popUpWindow',`height=${h},width=${w},left=${l},top=100,toolbar=no,menubar=no,location=no,directories=no,status=yes`);
        window.close();
    });

    // convert type to camelcase
    let type = localStorage.type.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    $('.calculator, body, html').addClass(type);

    let resize = () => {
        let $d = $(document),
            $w = $(window),
            $c = $('.calculator');

        if($c.innerHeight() > $w.innerHeight())
            window.resizeBy(0, $d.innerHeight() - $w.innerHeight());
        else
            window.resizeBy(0, $c.innerHeight() - $w.innerHeight());

        if($c.innerWidth() > $w.innerWidth())
            window.resizeBy($d.innerWidth() - $w.innerWidth(), 0);
        else
            window.resizeBy($c.innerWidth() - $w.innerWidth(), 0);
    }

    // check if window is child
    if(!window.locationbar.visible){
        $('.popout').hide();
        resize();
        let timeout;
        $(window).resize(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                resize();
            }, 200);
        });  
    }
    

    if(localStorage.theme !== 'custom')
        theme.load(localStorage.theme);

    else{
        try{
            theme.load('custom');
        } catch(e){
            theme.load('google');
        }
    }

    let prevState = {};
    window.calculator = new Calculator({
        state:        localStorage,
        screenWrap:   '.input-wrap',
        screen:       '.input',
        screenBefore: '.input-before',
        screenAfter:  '.input-after',
        radDeg:       '#rad-deg',
        onAdd: (char, event) => {
            window.trackButton(char, event);
            Sentry.addBreadcrumb({
                category: 'input',
                message: `char: ${char}`,
                level: 'info'
            });
        },
        onStateUpdate: (state) => {
            let extract = {
                radDeg: state.radDeg,
                screen: state.screen,
                before: state.before,
                history: state.history
            }
            // only add breadcrumb
            // if state has changed
            if(JSON.stringify(extract) !== JSON.stringify(prevState)){
                prevState = extract;
                Sentry.addBreadcrumb({
                    category: 'state',
                    message: JSON.stringify(extract),
                    level: 'info'
                });
                Sentry.configureScope((scope) => {
                    scope.setExtra("localStorage", JSON.stringify(localStorage));
                });
            }
        }
    });

    $('body').on('click', '.button[value]', function() {
        let value = $(this).attr('value');
        calculator.add(value, 'click');
    });

    $('body').on('click', '.button[fun]', function() {
        let fun = $(this).attr('fun');
        window.trackButton(fun, 'click');
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
                'qr': '\u221A(',
                'rt': '^(1/',
                'ro': '^(1/',
                'ab': 'abs('
            };
            if(Object.keys(phrases).includes(phrase)){
                let add = phrases[phrase];
                phrase = '';
                calculator.add(add, 'keypress');
                return false;
            }
        }


        let functionCodes = {
            '8':        'clear',
            'shift-8':  'allClear',
            '13':       'solve',
            '9':        'toggleMode',
            '38':       'historyUp',
            '40':       'historyDown',
            'ctrl-86':  'paste',
            'ctrl-67':  'copy'
        };
        let fnName = `${e.shiftKey ? 'shift-' : ''}${code}`;
        fnName = `${e.metaKey||e.ctrlKey ? 'ctrl-' : ''}${fnName}`;


        if(calculator[functionCodes[fnName]]){
            window.trackButton(functionCodes[fnName], 'keypress');
            calculator[functionCodes[fnName]]();
            return false;
        }


        let functionKeys = {
            '=': 'solve'
        };
        if(calculator[functionKeys[key]]){
            window.trackButton(functionKeys[key], 'keypress');
            calculator[functionKeys[key]]();
            return false;
        }


        // fix pi
        let subs = {
            'p': '\u03C0',
            'P': '\u03C0',
            'E': 'e',
            '\u00D7': 'x',
            '\u00D7': 'X',
            '\u00D7': '*',
            '\u00F7': '/'
        };
        if(typeof subs[key] !== 'undefined') key = subs[key];


        let permits = [
            /[0-9]/,
            '.',
            '(', ')',
            '-', '+', '*', '/', '^',
            'e',
            '%', '!',
            '\u03C0'
        ],
        permitted = false;
        permits.forEach((permit) => {
            if(typeof permit == 'object')
                permitted = permit.test(key);

            else if(permit == code || permit == key)
                permitted = true;
        });


        if(permitted){
            calculator.add(key, 'keypress');
            return false;
        }
    });
});
