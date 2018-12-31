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
        chrome.browserAction.onClicked.addListener(function(tab) {
            window.close();
        });
    }
});

if(localStorage.type == "screen-only"){
    $("html,body").css({"width": 204, "height": 54});
}

else if(localStorage.type == "normal"){
    $("html,body").css({"width": 229, "height": 292});
}

else{
    $("html,body").css({"width": 435, "height": 292});
}

$(document).ready(function() {
    if(localStorage.dev != "true"){ //track button presses
        var buttons = $(".button");
        for (var i = 0; i < buttons.length; i   ++) {
            buttons[i].addEventListener('click', trackButton);
        }
    }

    if(localStorage.type == "screen-only"){
        $("#input-container").css({"padding-right":"8px"});
        $("#input").css({"width":"100%"});
        $(".input-text").hide();
        $("#scientific-1").remove();
        $("#scientific-2").remove();
        $("#input-container > .text").hide();
        $("#number-container").remove();
        $(".calculator").css({"padding":"5px"});
    }

    else if(localStorage.type == "normal"){
        $("#scientific-1").remove();
        $("#scientific-2").remove();
        $("#number-container").css({"display":"inline-block"});
        $("#input").css({"width":"100%"});
        $("#input-container > .text").hide();
        $(".calculator").css({"padding":"16px"});
    }

    else{
        $("#scientific-1").css({"display":"inline-block"});
        $("#number-container").css({"display":"inline-block"});
        $(".calculator").css({"padding":"16px"});
    }

    chrome.tabs.getCurrent(function (tab) {
        if(tab != undefined){
            $("html,body").css({"width":"100%", "height":"100%"});
            myLibrary("#calculator-container").center(); //center calculator on page
        }
    });

    if(localStorage.theme != "custom"){
        theme.load(localStorage.theme);
    }

    else{
        let injectTheme = $.parseJSON(localStorage.customTheme);
        if(injectTheme.manifest != undefined && injectTheme.manifest.version != undefined && injectTheme.manifest.version > 0 && theme.validate(injectTheme)){
            theme.load(injectTheme);
        }

        else{
            localStorage.theme = "google";
            $.getJSON("assets/themes/google.json", function(injectTheme){
                theme.load(injectTheme);
            });
        }
    }
});

if(localStorage.dev != "true"){
    function trackButton(e) {
        analyticsEvent(e.target.id , "clicked");
    };
}

$(document).ready(() => {
    calculator.ini({
        storage: "localStorage",
        selector: {
            screen: "#input",
            radDeg: "#rad-deg",
            radDegInvert: "#rad-deg-invert"
        },
        options: {
            log : true
        },
        max : 15
    });
});
