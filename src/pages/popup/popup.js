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
        chrome.browserAction.onClicked.addListener(() => {
            window.close();
        });
    }
});

if(localStorage.type == "screen-only"){
    $("html,body").css({"width": 300, "height": 73});
}

else if(localStorage.type == "normal"){
    $("html,body").css({"width": 222, "height": 286});
}

else{
    $("html,body").css({"width": 434, "height": 303});
}

$(document).ready(function() {
    if(localStorage.dev != "true"){ //track button presses
        var buttons = $(".button");
        for (var i = 0; i < buttons.length; i   ++) {
            buttons[i].addEventListener('click', trackButton);
        }
    }

    if(localStorage.type == "screen-only"){
        $('.calculator').addClass('screenOnly');
        $("#scientific-1").remove();
        $("#scientific-2").remove();
    }

    else if(localStorage.type == "normal"){
        $("#scientific-1").remove();
        $("#scientific-2").remove();
        $("#number-container").css({"display":"inline-block"});
        $("#input").css({"width":"100%"});
        $("#input-container > .text").hide();
    }

    else{
        $('.calculator').addClass('scientific');
        $("#scientific-1").css({"display":"inline-block"});
        $("#number-container").css({"display":"inline-block"});
    }

    if(localStorage.theme !== 'custom'){
        theme.load(localStorage.theme);
    }

    else{
        try{
            theme.load('custom');
        } catch(e){
            theme.load('google');
        }
    }
});



$(document).ready(() => {
    window.calculator = new Calculator({
        storage:      localStorage,
        screenWrap:   $(".input-wrap"),
        screen:       $(".input"),
        screenBefore: $(".input-before"),
        screenAfter:  $(".input-after"),
        radDeg:       $("#rad-deg")
    });
});
