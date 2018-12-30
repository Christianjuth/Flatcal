if(typeof localStorage.tutorial === "undefined" || localStorage.tutorial == "false"){
    localStorage.tutorial = true;
    chrome.tabs.create({
        url : "/pages/options/options.html",
        active : true
    });
}


if(typeof localStorage.customTheme === "undefined"){
    $.getJSON(chrome.extension.getURL('resources/themes/default.json'), function(theme) {
        localStorage.customTheme = JSON.stringify(theme);
    });
}
if(typeof localStorage.type === "undefined") localStorage.type = "scientific";
if(typeof localStorage.theme === "undefined") localStorage.theme = "google";
if(typeof localStorage.radDeg === "undefined") localStorage.radDeg = "deg";
if(typeof localStorage.m === "undefined") localStorage.m = "0";
if(typeof localStorage.dev === "undefined") localStorage.dev = "false";
if(typeof localStorage.guid === "undefined") localStorage.guid = guid();



// Generate global universal identifier
// eg. a9f1a84e-5892-0313-1bde-7703f53e6c31
let guid = () => {
    let s = () => {
        return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
    };

    return `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}`;
}
