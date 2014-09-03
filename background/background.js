if(localStorage.tutorial == undefined || localStorage.tutorial == false){
    localStorage.tutorial = false;
    var newURL = "../tutorial/tutorial.html";
    chrome.tabs.create({ url: newURL });
}

if(localStorage.customTheme == undefined){
    $.getJSON(chrome.extension.getURL('resources/themes/default.json'), function(theme) {
        localStorage.customTheme = JSON.stringify(theme);
    });
}

if(localStorage.theme == undefined){
    localStorage.theme = "google";
}

if(localStorage.scientific == undefined){
    localStorage.scientific = "true";
}

if(localStorage.screenOnly == undefined){
    localStorage.screenOnly = "false";
}

if(localStorage.radDeg == undefined){
    localStorage.radDeg = "deg";
}

if(localStorage.m == undefined){
    localStorage.m = "0";
}

if(localStorage.dev == undefined){
    localStorage.dev = "false";
}

if(localStorage.noNotifyDelay == undefined){
    localStorage.noNotifyDelay = "false";
}

if(localStorage.limitNotifications == undefined){
    localStorage.limitNotifications = "false";
}

if(localStorage.notify == undefined){
    localStorage.notify = JSON.stringify({
        id : 0,
        date : moment().format("YYYYMMDD"),
        delay : 0
    });
}
