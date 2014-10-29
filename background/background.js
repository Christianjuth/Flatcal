if(typeof localStorage.tutorial === "undefined" || localStorage.tutorial == "false"){
    localStorage.tutorial = false;
    tutorial();
}
if(typeof localStorage.customTheme === "undefined"){
    $.getJSON(chrome.extension.getURL('resources/themes/default.json'), function(theme) {
        localStorage.customTheme = JSON.stringify(theme);
    });
}
if(typeof localStorage.theme === "undefined") localStorage.theme = "google";
if(typeof localStorage.scientific === "undefined") localStorage.scientific = "true";
if(typeof localStorage.screenOnly === "undefined") localStorage.screenOnly = "false";
if(typeof localStorage.radDeg === "undefined") localStorage.radDeg = "deg";
if(typeof localStorage.m === "undefined") localStorage.m = "0";
if(typeof localStorage.dev === "undefined") localStorage.dev = "false";
if(typeof localStorage.noNotifyDelay === "undefined") localStorage.noNotifyDelay = "false";
if(typeof localStorage.limitNotifications === "undefined") localStorage.limitNotifications = "false";
if(typeof localStorage.notify === "undefined"){
    localStorage.notify = JSON.stringify({
        id : 0,
        date : moment().format("YYYYMMDD"),
        delay : 0
    });
}
if(typeof localStorage.guid === "undefined") localStorage.guid = guid();

function tutorial() {
    source = "../tutorial/tutorial.html";
    chrome.tabs.query({}, function(tabs) {
        var Open = true;
        for(i = 0; i < tabs.length; i++){
            Open = Open && (String(tabs[i].url).indexOf(source) == -1);
            console.log(tabs[i]);
        }
        if(Open == true && tabs.length > 0){
            chrome.tabs.create({
                url : source,
                active : true
            });
        }
    });
}

function guid(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
