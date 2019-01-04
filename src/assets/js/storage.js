// Generate global universal identifier
// eg. a9f1a84e-5892-0313-1bde-7703f53e6c31
let guid = () => {
    let s = () => {
        return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
    };

    return `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}`;
}


let defaultStorage = {
    tutorial: false,
    type: 'scientific',
    theme: 'google',
    radDeg: 'deg',
    m: '0',
    dev: false,
    guid: guid(),
    screen: '0'
};



Object.keys(defaultStorage).forEach(key => {
    if(typeof localStorage[key] === 'undefined') localStorage[key] = defaultStorage[key];
});


if(typeof localStorage.tutorial === 'undefined' || localStorage.tutorial == 'false'){
    localStorage.tutorial = true;
    chrome.tabs.create({
        url: '/pages/options/options.html',
        active: true
    });
}


if(typeof localStorage.customTheme === 'undefined'){
    $.getJSON(chrome.extension.getURL('assets/themes/google.json'), function(theme) {
        localStorage.customTheme = JSON.stringify(theme);
    });
}


console.log('FlatCal is open source: https://github.com/christianjuth/flatcal')