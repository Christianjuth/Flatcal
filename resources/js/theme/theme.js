var theme = {
    ini : function(theme) {
        this.load(theme);
    },

    load : function(json){
        if(typeof json === "string") json = this.get(json);
        if(json == false){
            localStorage.theme = "google";
            json = this.get("google");
        }
        injectCSS(json);
        return;
    },

    set: function(json){
        if(typeof json === "string") json = this.get(json);
        theme.update(json)
        injectCSS(json);
        return;
    },

    get : function(name){
        var themesOut = null;
        if(name == undefined){
            themesOut = new Array();
            data = ajaxGetFile("../resources/themes/themes-list.json", "json");
            for(i = 0; i < data.length; i++){
                themesOut.push(data[i].toLowerCase());
            };
        }

        else{
            themesOut = new Array();
            data = ajaxGetFile("../resources/themes/" + name + ".json", "json");
            themesOut = data;
        }

        return themesOut;
    },

    getCurrent : function(){
        if(localStorage.theme != "custom"){
            return localStorage.theme;
        }

        else{
            return $.parseJSON(localStorage.customTheme).manifest.name;
        }
    },

    save : function(json) {
        if(typeof json != "object") json = JSON.parse(json);
        if(json.manifest == undefined) json.manifest = {};
        json.manifest.version = 1.1;
        var blob = new Blob([JSON.stringify(json)], {
            type: "text/plain;charset=utf-8;",
        });
        if(json.manifest.name != undefined && json.manifest.name != undefined){
            saveAs(blob, json.manifest.name + ".json");
        }

        else{
            saveAs(blob, "my-theme.json");
        }
    },

    update : function(json) {
        localStorage.theme = "custom";

        localStorage.customTheme = JSON.stringify(json);
        customCalculatorTheme = jQuery.parseJSON(localStorage.customTheme);
    },

    sort:{
        foward : function(a,b){
            if(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase())return false;
            if(a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase())return true;
            return false;
        },

        reverse : function(a,b){
            if(a.toLocaleLowerCase() < b.toLocaleLowerCase()) return true;
            if(a.toLocaleLowerCase() > b.toLocaleLowerCase()) return false;
        }
    },

    reconstruct : function(theme){
        var settings = [];

        for(i = 0; i < settings.length; i++){
            if(arguments[0]);
        }
    },

    inject : {
        color : function(selector, value, fallback) {
            if(typeof value !== "undefined" && value !== ""){
                $(selector).css({"background": value});
                $(selector).unbind("mouseout");
                $(selector).mouseout(function() {
                    $(this).css({"background": value});
                });
            }

            else if(typeof fallback != "undefined" && fallback != ""){
                $(selector).css({"background": fallback});
                $(selector).unbind("mouseout");
                $(selector).mouseout(function() {
                    $(this).css({"background": fallback});
                });
            }
        },

        hoverColor : function(selector, value, fallback) {
            if(value != undefined && value != ""){
                $(selector).unbind("mouseover");
                $(selector).mouseover(function() {
                    $(this).css({"background-color":value});
                });
            }

            else if(fallback != undefined && fallback != ""){
                $(selector).unbind("mouseover");
                $(selector).mouseover(function() {
                    $(this).css({"background-color":fallback});
                });
            }
        },

        textColor : function(selector, value, fallback){
            if(value != undefined && value != ""){
                $(selector).css({"color":value});
            }

            else if(fallback != undefined && fallback != ""){
                $(selector).css({"color":fallback});
            }
        },

        font : function(selector, value, fallback) {
            if(value != undefined && value != ""){
                $(selector).css({"font-family":value});
            }

            else{
                $(selector).css({"font-family":fallback});
            }
        },

        borderColor : function(selector, value, fallback) {
            if(value != undefined && value != ""){
                $(selector).css({"border-color":value});
            }

            else{
                $(selector).css({"border-color":fallback});
            }
        },

        outlineColor : function(selector, value, fallback) {
            if(value != undefined && value != ""){
                $(selector).css({"outline-color":value});
            }

            else{
                $(selector).css({"outline-color":fallback});
            }
        },

        borderWidth : function(selector, value, fallback) {
            value = parseFloat(value);
            fallback = parseFloat(fallback);
            if(value != undefined){
                $(selector).css({"outline-offset": String(((value - 1) * -1) * 1) + "px", "outline-width": String(value * 1) + "px"});
            }

            else{
                $(selector).css({"outline-offset": String(((fallback - 1) * -1) * 1) + "px", "outline-width": String(fallback * 1) + "px"});
            }
        }
    }
}

//-------------------------css effects----------------------------//
$(document).on("click", ".button", function (e) {
    var $clicked = $(this);

    //gets the clicked coordinates
    var offset = $clicked.offset();
    var relativeX = (e.pageX - offset.left);
    var relativeY = (e.pageY - offset.top);
    var width = $clicked.width();


    var $ripple = $clicked.find('.ripple');

    //puts the ripple in the clicked coordinates without animation
    $ripple.addClass("notransition");
    $ripple.css({
        "top": relativeY,
        "left": relativeX
    });
    $ripple[0].offsetHeight;
    $ripple.removeClass("notransition");

    //animates the button and the ripple
    $clicked.addClass("hovered");
    $ripple.css({
        "width": width * 2,
        "height": width * 2,
        "margin-left": -width,
        "margin-top": -width
    });

    setTimeout(function() {
        //resets the overlay and button
        $ripple.addClass("notransition");
        $ripple.attr("style", "");
        $ripple[0].offsetHeight;
        $clicked.removeClass("hovered");
        $ripple.removeClass("notransition");
    }, 300);
});

//------------------------inject theme------------------------//
var calculatorTheme = "";
function injectCSS(json) {
    calculatorTheme = json;

    //body
    theme.inject.color("#margins, .calculator-background", arguments[0].body.color, "#fff");

    if(arguments[0].body.color == "fff" || arguments[0].body.color == "#ffffff") theme.inject.borderColor("#margins", "#eee");
    else theme.inject.borderColor("#margins", arguments[0].body.color, "#eee");

    //input
    if(typeof arguments[0].input !== "undefined"){
        theme.inject.color("#input-container", arguments[0].input.color, "#eee");
        theme.inject.borderColor("#input-container", arguments[0].input.borderColor, arguments[0].body.color);
        theme.inject.textColor("#input-container, #input-container > div > span", arguments[0].input.textColor, "#000");
    }

    //buttons
    if(typeof arguments[0].button !== "undefined"){
        theme.inject.color(".button", arguments[0].button.color, "#eee");
        theme.inject.hoverColor(".button", arguments[0].button.hoverColor);
        theme.inject.outlineColor(".button", arguments[0].body.color, "#eee");
        theme.inject.textColor(".button", arguments[0].button.textColor, "#000");
        theme.inject.borderWidth(".button", arguments[0].button.borderWidth, 1);

        //numbers
        if(typeof arguments[0].button.numbers !== "undefined"){
            theme.inject.color(".number", arguments[0].button.numbers.color);
            theme.inject.hoverColor(".number", arguments[0].button.numbers.hoverColor);
            theme.inject.textColor(".number", arguments[0].button.numbers.textColor);
        }

        //decimal
        if(typeof arguments[0].button.point !== "undefined"){
            theme.inject.color("#point", arguments[0].button.point.color);
            theme.inject.hoverColor("#point", arguments[0].button.point.hoverColor);
            theme.inject.textColor("#point", arguments[0].button.point.textColor);
        }

        //percentage
        if(typeof arguments[0].button.percentage !== "undefined"){
            theme.inject.color("#percentage", arguments[0].button.percentage.color);
            theme.inject.hoverColor("#percentage", arguments[0].button.percentage.hoverColor);
            theme.inject.textColor("#percentage", arguments[0].button.percentage.textColor);
        }

        //ce
        if(typeof arguments[0].button.ce !== "undefined"){
            theme.inject.color("#ce", arguments[0].button.ce.color);
            theme.inject.hoverColor("#ce", arguments[0].button.ce.hoverColor);
            theme.inject.textColor("#ce", arguments[0].button.ce.textColor);
        }

        //positive negetive
        if(typeof arguments[0].button.positiveNegative !== "undefined"){
            theme.inject.color("#positive-negative", arguments[0].button.positiveNegative.color);
            theme.inject.hoverColor("#positive-negative", arguments[0].button.positiveNegative.hoverColor);
            theme.inject.textColor("#positive-negative", arguments[0].button.positiveNegative.textColor);
        }

        //opp
        if(typeof arguments[0].button.operators !== "undefined"){
            theme.inject.color("#plus, #subtract, #divide, #multiply", arguments[0].button.operators.color);
            theme.inject.hoverColor("#plus, #subtract, #divide, #multiply", arguments[0].button.operators.hoverColor);
            theme.inject.textColor("#plus, #subtract, #divide, #multiply", arguments[0].button.operators.textColor);
        }

        //
        if(typeof arguments[0].button.equal !== "undefined"){
            theme.inject.color("#equal", arguments[0].button.equal.color);
            theme.inject.hoverColor("#equal", arguments[0].button.equal.hoverColor);
            theme.inject.textColor("#equal", arguments[0].button.equal.textColor);
        }
    }

    return;
}

function ajaxGetFile(file, type) {
    var dataOut = false;
    $.ajax({
        url: file,
        async: false,
        dataType: type,
        tryCount : 0,
        retryLimit : 15,
        success:function(data) {
            dataOut = data;
        },
        error: function(){
            //location.reload(); //This is a hack
        }
    });

    return dataOut;
}

$(document).ready(function() {
    //appends the overlay to each button
    $(".button").each(function() {
        var $this = $(this);
        $this.append("<div class='ripple'></div>");
    });
});
