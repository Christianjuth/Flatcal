//-------------------------validate-----------------------------//
var validate = {
    font : function(font){
        var ok = true;
        var fonts = ["arial","oswald","sans-serif","digital","helvetica"];
        for(i = 0; i < font.length; i++){
            var acceptableFont = false;
            for(x = 0; x < fonts.length; x++){
                acceptableFont = acceptableFont || (String(font[i]).toLowerCase() == fonts[x]);
            }
            ok = ok && acceptableFont;
        }
        return ok;
    },

    hex : function(color){
        var ok = true;
        for(i = 0; i < color.length; i++){
            color[i] = String(color[i]).replace(/#/,"");
            ok = ok && ((typeof color[i] === "string") && (color[i].length === 6 || color[i].length === 3)
                        && !isNaN(parseInt(color[i], 16)));
        }
        return ok;
    },

    array : function(data, type){
        var ok = true;
        for(i = 0; i < data.length; i++){
            result = result && (typeof data[i] === type);
        }
        return ok;
    },

    json : function(json) {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    },

    theme : function(json){
        if(typeof json === "string") json = theme.get(json);
        var ok = true;
        var okFonts = this.font([json.button.font, json.input.font]);
        var okColors = this.hex([json.button.color, json.input.color]);

        ok = ok && (json.manifest != undefined) && (json.body != undefined) && (json.input != undefined) && (json.button != undefined) && (json.button.numbers != undefined) && (json.button.operators != undefined);

        ok = ok && okFonts && okColors;

        if(!ok){
            console.error("invalad theme");
        }

        return ok;
    }
}

//---------------------------theme-----------------------------//
var theme = {
    load : function(json){
        if(typeof json === "string") json = this.get(json);
        if(validate.theme(json)){
            injectCSS(json);
        }
        return;
    },

    set : function(json){
        if(typeof json === "string") json = this.get(json);
        if(validate.theme(json)){
            theme.update(json)
            injectCSS(json);
        }
        return;
    },

    get : function(name){
        var themesOut = null;
        if(name == undefined){
            $.ajax({
                url: chrome.extension.getURL("/resources/themes/themes-list.json"),
                async: false,
                dataType: 'json',
                success: function (data) {
                    themesOut = new Array();
                    for(i = 0; i < data.length; i++){
                        themesOut.push(data[i].name.toLowerCase());
                    };
                }
            });
        }

        else{
            $.ajax({
                url: chrome.extension.getURL("/resources/themes/" + name + ".json"),
                async: false,
                dataType: 'json',
                success: function (data) {
                    themesOut = data;
                }
            });
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
    }
}

//-------------------------css effects----------------------------//
$(document).ready(function() {
    //appends the overlay to each button
    $(".button").each(function() {
        var $this = $(this);
        $this.append("<div class='ripple'></div>");
    });
});

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

function animateBlur(element, blur, blurDuration) {
    $(element).stop();
    $({
        blurRadius: 0
    }).animate({
        blurRadius: blur
    }, {
        duration: blurDuration,
        easing: 'swing', // or "linear"
        // use jQuery UI or Easing plugin for more options
        step: function() {
            if (blur == 0) this.blurRadius = 0;
            $(element).css({
                "-webkit-filter": "blur(" + this.blurRadius + "px)",
                "filter": "blur(" + this.blurRadius + "px)"
            });
        }
    });
}

//------------------------inject theme------------------------//
var calculatorTheme = "";
function injectCSS(json) {
    $(".button").unbind("mouseover").unbind("mouseout");
    calculatorTheme = json;

    //inject body css
    $("#margins").css({"background-color": json.body.color});

    //inject input css
    $("#input-container").css({
        "background-color": json.input.color,
        "color": json.input.textColor,
        "font-family": json.input.font,
        "border-color": json.input.borderColor
    });

    //check if #input had a border color defined in the theme theme file and if not set it as the same ad the bdy background color
    if (json.input.borderColor != undefined) {
        $("#input-container").css({"border-color": json.input.borderColor});
    } else {
        $("#input-container").css({"border-color": json.body.color})
    }

    //inject button css------------------------>
    $(".button").css({
        "background-color": json.button.color,
        "border-color": json.button.borderColor,
        "border-radius": json.button.borderRadius,
        "color": json.button.textColor,
        "font-family": json.button.font
    });

    $(".button").mouseover(function() {
        $(this).css({"background-color": json.button.hoverColor});
    });

    $(".button").mouseout(function() {
        $(this).css({"background-color": json.button.color});
    });

    //check if .button had a border color defined in the theme theme file and if not set it as the same ad the bdy background color
    if (json.button.borderColor != undefined && json.button.borderColor != ""){
        $(".button").css({"outline-color": json.button.borderColor});

    } else {
        $(".button").css({"outline-color": json.body.color});
    }

    //check if .button had a border color defined in the theme theme file and if not set it as the same ad the bdy background color
    if (json.button.borderWidth != undefined){
        $(".button").css({"outline-offset": (parseInt(json.button.borderWidth) - 1) * -1, "outline-width": json.button.borderWidth});

    } else {
        json.button.borderWidth = 1;
        theme.update(json);
        $(".button").css({"outline-offset": (parseInt(json.button.borderWidth) - 1) * -1, "outline-width": json.button.borderWidth});
    }

    //inject numbers css ---------------------------------------------->
    //background color
    if (json.button.numbers.color != "") {
        $(".number").css({"background-color": json.button.numbers.color});

        $(".number").unbind("mouseout").mouseout(function() {
            $(this).css({"background-color": json.button.numbers.color});
        });
    }

    //hover
    if (json.button.numbers.hoverColor != "") {
        $(".number").unbind("mouseover").mouseover(function() {
            $(this).css({"background-color": json.button.numbers.hoverColor});
        });
    }

    //text color
    if (json.button.numbers.textColor != "") {
        $(".number").css({"color": json.button.numbers.textColor});
    }

    //inject point css ---------------------------------------------->
    //background color
    if (json.button.point.color != "") {
        $("#point").css({"background-color": json.button.point.color});

        $("#point").unbind("mouseout").mouseout(function() {
            $(this).css({"background-color": json.button.point.color});
        });
    }

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
