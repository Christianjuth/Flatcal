<<<<<<< HEAD
<<<<<<< HEAD
var themes = theme.get();
=======
var themes = ["google", "ios", "android", "mac", "khanacademy", "digital-grey", "material-design"];
>>>>>>> dev
=======
var themes = ["calzy-light", "calzy-dark", "google", "ios", "android", "mac", "khanacademy", "digital-grey", "material-design"];
>>>>>>> dev
if(localStorage.theme == "custom" || localStorage.theme == "" || localStorage.theme == undefined) localStorage.theme = themes[themes.length - 1];

for(i = 0; i < themes.length; i++){
    if(localStorage.theme == themes[i] && i != themes.length - 1){
        localStorage.theme = themes[i + 1];
        break;
    }

    else if(localStorage.theme == themes[i]){
        localStorage.theme = themes[0];
        break;
    }
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

<<<<<<< HEAD
    if(localStorage.theme != "custom"){
        theme.load(localStorage.theme);
    }

    else{
        var injectTheme = $.parseJSON(localStorage.customTheme);
        if(injectTheme.manifest != undefined && injectTheme.manifest.version != undefined && injectTheme.manifest.version > 0 && validate.theme(injectTheme)){
            theme.load(injectTheme);
        }

        else{
            localStorage.theme = "google";
            $.getJSON("resources/themes/google.json", function(injectTheme){
                theme.load(injectTheme);
            });
        }
    }
=======
    if(localStorage.theme == "custom"){
        localStorage.theme = "google";
    }

    $.getJSON("./resources/themes/" + localStorage.theme + ".json", function(injectTheme){
        injectCSS(injectTheme);
    });
>>>>>>> dev
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
        _gaq.push(['_trackEvent', e.target.id , 'clicked']);
    };
}
