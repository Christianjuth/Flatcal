if(localStorage.screenOnly == "true"){
    $("html,body").css({"width":204, "height":54});
}

else if(localStorage.scientific == "false"){
    $("html,body").css({"width":229, "height":298});
}

else{
    $("html,body").css({"width":435, "height":298});
}

chrome.tabs.getCurrent(function (tab) {
    if(tab != undefined){ //if not popup
        myLibrary("#calculator-container").center(); //center calculator on page
        document.getElementById("margins").style.borderRadius = "6px"; //round edgess
        document.getElementById("margins").style.border = "1px solid #ddd"; //add border incase background is white
        $(document).ready(function() {
            animatedShadow("#margins"); //add animated shadow
        });
    }
});

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
        $("#scientific-container").remove();
        $("#number-container").remove();
        $("#margins").css({"padding":"5px"});
    }

    else if(localStorage.scientific == "false"){
        $("#scientific-container").remove();
        $("#number-container").css({"display":"inline-block"});
        $("#input-container").css({"width":"184px"});
        $("#input").css({"width":"100%"});
        $(".input-text").hide();
        $("#margins").css({"padding":"16px"});
    }

    else{
        $("#input-container").css({"width":"390px"});
        $("#scientific-container").css({"display":"inline-block"});
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
        if(injectTheme.manifest != undefined && injectTheme.manifest.version != undefined && injectTheme.manifest.version > 0 && validateTheme(injectTheme)){
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

function animatedShadow(selector) {
    var elm = $(selector),
        x = ~Math.round((0 - $(elm).offset().left - ($(elm).outerWidth() / 2) - 150) / 175 - 14),
        y = ~Math.round((0 - $(elm).offset().top - ($(elm).outerHeight() / 2) - 150) / 175 - 13),
        cssVal = x+'px '+y+'px 0.2px #ddd';
    elm.css({'-webkit-box-shadow' : cssVal, 'box-shadow' : cssVal });

    $(document).on('mousemove', function(e) {
        var elm = $(selector),
            x = ~Math.round((e.pageX - $(elm).offset().left - ($(elm).outerWidth() / 2) - 150) / 175 - 14),
            y = ~Math.round((e.pageY - $(elm).offset().top - ($(elm).outerHeight() / 2) - 150) / 175 - 13),
            cssVal = x+'px '+y+'px 0.2px #ddd';
        elm.css({'-webkit-box-shadow' : cssVal, 'box-shadow' : cssVal });
    });

    window.onbeforeunload(function() {
        localStorage.tutorial = true;
    });
}

if(localStorage.dev != "true"){
    function trackButton(e) {
        analyticsEvent(e.target.id , "clicked");
    };
}
