// Set FlatCal Version
// This is imporant for error reporting
let version = '4.0.0';

if(typeof module !== 'undefined'){
    module.exports = version;
}





if(typeof localStorage == 'object'){

    // Generate global universal identifier
    // eg. a9f1a84e-5892-0313-1bde-7703f53e6c31
    let guid = () => {
        let s = () => {
            return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
        };

        return `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}`;
    };


    let defaultStorage = {
        tutorial: 0,
        type: 'scientific',
        theme: 'google',
        radDeg: 'deg',
        m: '0',
        dev: false,
        guid: guid(),
        screen: '0',
        before: '',
        history: '[]'
    };

    Object.keys(defaultStorage).forEach(key => {
        if(typeof localStorage[key] === 'undefined') localStorage[key] = defaultStorage[key];
    });


    if(typeof localStorage.tutorial === 'undefined' || localStorage.tutorial === 'true' || localStorage.tutorial < 1){
        localStorage.tutorial = 1;
        chrome.tabs.create({
            url: '/pages/options/options.html',
            active: false
        });
        chrome.tabs.create({
            url: '/pages/shortcuts/shortcuts.html',
            active: true
        });
    }

    if(typeof localStorage.customTheme === 'undefined'){
        $.getJSON(chrome.extension.getURL('assets/themes/google.json'), function(theme) {
            localStorage.customTheme = JSON.stringify(theme);
        });
    }

    if(typeof Sentry !== 'undefined' && localStorage.dev !== 'true'){
        Sentry.init({ 
            dsn: 'https://75fc44460c994e98816be244453d086d@sentry.io/1417579',
            release: `flatcal@${version}`
        });

        Sentry.configureScope((scope) => {
            scope.setUser({'id': localStorage.guid});
        });
    }

    console.log('FlatCal is open source! https://github.com/christianjuth/flatcal');
}




