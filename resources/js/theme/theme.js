//---------------------------theme-----------------------------//
var theme = {
    ini : function() {

    },

    load : function(json){
        if(typeof json === "string") json = this.get(json);
        if(this.validate(json)){
            injectCSS(json);
        }
        return;
    },

    set : function(json){
        if(typeof json === "string") json = this.get(json);
        if(this.validate(json)){
            theme.update(json)
            injectCSS(json);
        }
        return;
    },

    get : function(name){
        var themesOut = null;
        if(name == undefined){
            themesOut = new Array();
            data = ajaxGetFile("../resources/themes/themes-list.json", "json");
            for(i = 0; i < data.length; i++){
                themesOut.push(data[i].name.toLowerCase());
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
            if(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return true;
            if(a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return false;
        }
    },

    validate : function(json) {
        var goodTheme = true;
        var requiredColor = {
            presence: true,
            format: {
                pattern: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
            }
        }
        var color = {
            format: {
                pattern: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i //look for color (e.g. #fff or #ffffff)
            }
        }
        var colorOrBlank = {
            format: {
                pattern: /^(#[0-9a-f]{3}|#[0-9a-f]{6}|\s*$)$/i
            }
        }

        goodTheme = goodTheme && validate(json.manifest, {
            version: {
                numericality: {
                    lessThanOrEqualTo: 1.1
                }
            }
        }) == undefined;

        goodTheme = goodTheme && validate(json.body, {
            color : requiredColor
        }) == undefined;

        goodTheme = goodTheme && validate(json.input, {
            color : requiredColor,
            borderColor : requiredColor,
            textColor : requiredColor
        }) == undefined;

        if(json.button.borderWidth == undefined || (json.button.borderWidth == "" && json.button.borderWidth != 0)){
            json.button.borderWidth = 1;
        }

        else{
            json.button.borderWidth = parseInt("0" + json.button.borderWidth);
        }

        json.button.borderRadius = parseInt("0" + json.button.borderRadius);
        goodTheme = goodTheme && validate(json.button, {
            color : requiredColor,
            hoverColor : requiredColor,
            borderColor : colorOrBlank,
            borderRadius: {presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 25 } },
            borderWidth: {numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 5 } },
            textColor : requiredColor
        }) == undefined;

        var buttonProperties = ["numbers", "point", "ce", "positiveNegative", "operators", "equal"];
        for(i = 0; i < buttonProperties.length; i++){
            json.button[buttonProperties[i]].color
            goodTheme = goodTheme && validate(json.button[buttonProperties[i]], {
                color : colorOrBlank,
                borderColor : colorOrBlank,
                textColor : colorOrBlank
            }) == undefined;
        }

        return goodTheme;
    },

    inject : {
        color : function(selector, value, fallback) {
            if(value != undefined && value != ""){
                $(selector).css({"background-color":value});
                $(selector).unbind("mouseout");
                $(selector).mouseout(function() {
                    $(this).css({"background-color":value});
                });
            }

            else if(fallback != undefined && fallback != ""){
                $(selector).css({"background-color":fallback});
                $(selector).unbind("mouseout");
                $(selector).mouseout(function() {
                    $(this).css({"background-color":fallback});
                });
            }
        },

        hoverColor : function(selector, value, fallback) {
            if(value != undefined && value != ""){
                $(selector).mouseover(function() {
                    $(this).css({"background-color":value});
                });
            }

            else if(fallback != undefined && fallback != ""){
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
            if(value != undefined){
                $(selector).css({"outline-offset": (parseInt(value) - 1) * -1, "outline-width": value});
            }

            else{
                $(selector).css({"outline-offset": (parseInt(fallback) - 1) * -1, "outline-width": fallback});
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
    $(".button").unbind("mouseover").unbind("mouseout"); //reset event listeners
    calculatorTheme = json;

    //body
    theme.inject.color("#margins", json.body.color, "#fff");

    //input
    theme.inject.color("#input-container", json.input.color, "#eee");
    theme.inject.borderColor("#input-container", json.input.borderColor, json.body.color);
    theme.inject.textColor("#input-container", json.input.textColor, "#000");
    theme.inject.font("#input-container", json.input.font, "arial");

    //buttons
    theme.inject.color(".button", json.button.color, "#eee");
    theme.inject.hoverColor(".button", json.button.hoverColor, json.button.color);
    theme.inject.outlineColor(".button", json.button.borderColor, json.body.color);
    theme.inject.textColor(".button", json.button.textColor, "#000");
    theme.inject.font(".button", json.button.font, "arial");
    theme.inject.borderWidth(".button", json.button.borderWidth, 1);

    //numbers
    theme.inject.color(".number", json.button.numbers.color);
    theme.inject.hoverColor(".number", json.button.numbers.hoverColor);
    theme.inject.textColor(".number", json.button.numbers.textColor);


    if (json.button.point.color != "") theme.inject.color("#point", json.button.point.color, "#eee");

    //hover
    if (json.button.point.hoverColor != "") {
        $("#point").unbind("mouseover").mouseover(function() {
            $(this).css({"background-color": json.button.point.hoverColor});
        });
    }

    //text color
    if (json.button.point.textColor != "") {
        $("#point").css({"color": json.button.point.textColor});
    }

    //inject ce css ---------------------------------------------->
    //background color
    if (json.button.ce.color != "") {
        $("#ce").css({"background-color": json.button.ce.color});

        $("#ce").unbind("mouseout").mouseout(function() {
            $(this).css({"background-color": json.button.ce.color});
        });
    }

    //hover
    if (json.button.ce.hoverColor != "") {
        $("#ce").unbind("mouseover").mouseover(function() {
            $(this).css({"background-color": json.button.ce.hoverColor});
        });
    }

    //text color
    if (json.button.ce.textColor != "") {
        $("#ce").css({"color": json.button.ce.textColor});
    }

    //positive negetive css ---------------------------------------------->
    //background color
    if (json.button.positiveNegative.color != "") {
        $("#positive-negative").css({"background-color": json.button.positiveNegative.color});

        $("#positive-negative").mouseout(function() {
            $(this).css({"background-color": json.button.positiveNegative.color});
        });
    }

    //hover
    if (json.button.positiveNegative.hoverColor != "") {
        $("#positive-negative").mouseover(function() {
            $(this).css({"background-color": json.button.positiveNegative.hoverColor});
        });
    }

    //text color
    if (json.button.positiveNegative.textColor != "") {
        $("#positive-negative").css({"color": json.button.positiveNegative.textColor});
    }

    //inject opp css css ---------------------------------------------->
    //background color
    if (json.button.operators.color != "") {
        $("#plus, #subtract, #divide, #multiply").css({"background-color": json.button.operators.color});

        $("#plus, #subtract, #divide, #multiply").unbind("mouseout");
        $(".opp").mouseout(function() {
            var id = $(this).attr("id");
            if(id == "plus" || id == "subtract" || id == "divide" || id == "multiply"){
                $(this).not("#mod").css({"background-color": json.button.operators.color});
            }
        });
    }

    //hover
    if (json.button.operators.hoverColor != "") {
        $("#plus, #subtract, #divide, #multiply").unbind("mouseover");
        $(".opp").mouseover(function() {
            var id = $(this).attr("id");
            if(id == "plus" || id == "subtract" || id == "divide" || id == "multiply"){
                $(this).css({"background-color": json.button.operators.hoverColor});
            }
        });
    }

    //text color
    if(json.button.operators.textColor != "") {
        $("#plus, #subtract, #divide, #multiply").css({"color": json.button.operators.textColor});
    }

    //inject equal css css ---------------------------------------------->
    //background color
    if(json.button.equal.color != "") {
        $("#equal").css({"background-color": json.button.equal.color});

        $("#equal").unbind("mouseout").mouseout(function() {
            $(this).css({"background-color": json.button.equal.color});
        });
    }

    //hover
    if(json.button.equal.hoverColor != "") {
        $("#equal").unbind("mouseover").mouseover(function() {
            $(this).css({"background-color": json.button.equal.hoverColor});
        });
    }

    //text color
    if(json.button.equal.textColor != "") {
        $("#equal").css({"color": json.button.equal.textColor});
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
            location.reload(); //This is a hack
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
