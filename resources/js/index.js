if(localStorage.screenOnly == "true"){
    $("html,body").css({"width":204, "height":54});
}

else if(localStorage.scientific == "false"){
    $("html,body").css({"width":229, "height":298});
}

else{
    $("html,body").css({"width":435, "height":298});
}

$(document).ready(function() {
    if(localStorage.dev != "true"){ //track button presses
        var buttons = $(".button");
        for (var i = 0; i < buttons.length; i   ++) {
            buttons[i].addEventListener('click', trackButton);
        }
    }

    if(localStorage.screenOnly == "true"){
        $("#input-container").css({"width":"184px", "padding-right":"8px"});
        $("#input").css({"width":"100%"});
        $(".input-text").hide();
        $("#scientific-1").remove();
        $("#scientific-2").remove();
        $("#input-container > .text").hide();
        $("#number-container").remove();
        $("#margins").css({"padding":"5px"});
    }

    else if(localStorage.scientific == "false"){
        $("#scientific-1").remove();
        $("#scientific-2").remove();
        $("#number-container").css({"display":"inline-block"});
        $("#input-container").css({"width":"184px"});
        $("#input").css({"width":"100%"});
        $("#input-container > .text").hide();
        $("#margins").css({"padding":"16px"});
    }

    else{
        $("#input-container").css({"width":"390px"});
        $("#scientific-1").css({"display":"inline-block"});
        $("#number-container").css({"display":"inline-block"});
        $("#margins").css({"padding":"16px"});
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
        var injectTheme = $.parseJSON(localStorage.customTheme);
        if(injectTheme.manifest != undefined && injectTheme.manifest.version != undefined && injectTheme.manifest.version > 0 && theme.validate(injectTheme)){
            theme.load(injectTheme);
        }

        else{
            localStorage.theme = "google";
            $.getJSON("resources/themes/google.json", function(injectTheme){
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
