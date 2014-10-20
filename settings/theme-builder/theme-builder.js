var enable = "";
var customCalculatorTheme = jQuery.parseJSON(localStorage.customTheme);
$(document).ready(function() {
    myLibrary('#theme-builder-container').center()
    theme.set(customCalculatorTheme);

    $(document.body).on("click", "#save", function() {
        theme.save(localStorage.customTheme);
    });

    $(".color-notclearable").each(function() {
        $(this).val(customCalculatorTheme[$(this).attr("json")][$(this).attr("state")]);
    });

    $(".color").each(function() {
        var jsonTheme = $(this).attr("json");
        jsonTheme = jsonTheme.split(".");
        if(jsonTheme.length == 1){
            $(this).val(customCalculatorTheme[jsonTheme][$(this).attr("state")]);
        }

        else{
            $(this).val(customCalculatorTheme[jsonTheme[0]][jsonTheme[1]][$(this).attr("state")]);
        }
    });

    $("#manifest > #name").val(customCalculatorTheme.manifest.name).change(function() {
        changeTheme($(this).attr("json"), $(this).attr("state"), $(this).val());
    });

    $(".color-notclearable").spectrum({
        preferredFormat: "hex",
        showInput: true,
        allowEmpty:false,
        showButtons: false,
        move: function(color) {
            var color = color + "";
            changeTheme($(this).attr("json"), $(this).attr("state"), color);
        },
        change: function(color) {
            var color = color + "";
            changeTheme($(this).attr("json"), $(this).attr("state"), color);
        }
    });

    $(".color").spectrum({
        preferredFormat: "hex",
        showInput: true,
        allowEmpty:true,
        showButtons: false,
        move: function(color) {
            var color = color + "";
            changeTheme($(this).attr("json"), $(this).attr("state"), color);
        },
        change: function(color) {
            var color = color + "";
            changeTheme($(this).attr("json"), $(this).attr("state"), color);
        }
    });

    //reset button
    $(document.body).on("click", ".reset", function() {
        reset(this);
    });

    if(localStorage.scientific == "false"){
        $("#scientific-container").remove();
        $("#number-container").css({"display":"inline-block"});
        $("#input-text").remove();
        $("#input-container").css({"width":"183px"});
        $("#margins").css({"margin-left":"-118px"});
        $("#margins").css({"padding":"20px"});
    }

    else{
        $("#scientific-container").css({"display":"inline-block"});
        $("#number-container").css({"display":"inline-block"});
    }

    for(i = 0; i < $(".font-selctor").length; i ++){
        var element = $(".font-selctor")[i];

        $(element).val(customCalculatorTheme[$(element).attr("json")].font).chosen({disable_search_threshold: 10});
    }

    $(".font-selctor").change(function() {
        changeTheme($(this).attr("json"), "font", $(this).val());
        theme.set(customCalculatorTheme);
    });

    new Dragdealer('outline-width-slider', {
        animationCallback: function(x, y) {
            $('#outline-width-slider > div').text(Math.round(x * 5));
            changeTheme($('#outline-width-slider').attr("json"), $('#outline-width-slider').attr("state"), Math.round(x * 5));
            theme.set(customCalculatorTheme);
        },
        x: customCalculatorTheme.button.borderWidth / 5
    });

    $("#left-container").scroll(function() {
        $("*").spectrum("hide");
    });

    option.create("numbers","json.button.numbers","colorhovertext",false);
    option.create("ce button","json.button.ce","colorhovertext",false);
    option.create("+/- button","json.button.positiveNegative","colorhovertext",false);
    option.create("operators","json.button.operators","colorhovertext",false);
    option.create("equal button","json.button.equal","colorhovertext",false);
    option.create("decmel button","json.button.point","colorhovertext",false);
});

function reset(element) {
    //element is the element being reset
    $(element).parent().children("div").children("input").val("");
    $(element).parent().children("div").children("input").css({"background-color":"#fff"});
    jsonTheme = $(element).parent().children("div").children("input").attr("json");

    jsonTheme = jsonTheme.split(".");

    if(jsonTheme.length == 2){
        customCalculatorTheme[jsonTheme[0]][jsonTheme[1]]["color"] = "";
        customCalculatorTheme[jsonTheme[0]][jsonTheme[1]]["hoverColor"] = "";
        customCalculatorTheme[jsonTheme[0]][jsonTheme[1]]["textColor"] = "";
    }

    else{
        customCalculatorTheme[jsonTheme[0]]["color"] = "";
        customCalculatorTheme[jsonTheme[0]]["hoverColor"] = "";
        customCalculatorTheme[jsonTheme[0]]["textColor"] = "";
    }

    $(".color").spectrum({
        preferredFormat: "hex",
        showInput: true,
        allowEmpty:true,
        showButtons: false,
        move: function(color) {
            var color = color + "";
            changeTheme($(this).attr("json"), $(this).attr("state"), color);
        },
        change: function(color) {
            var color = color + "";
            changeTheme($(this).attr("json"), $(this).attr("state"), color);
        }
    });

    theme.set(customCalculatorTheme);
    return;
}

//functions
function changeTheme(jsonTheme, state, value) {
    var parsedJSON = jsonTheme.split(".");
    var themeElement = customCalculatorTheme;
    for(i = 0; i < parsedJSON.length - 1; i++){
        themeElement = themeElement[parsedJSON[i+1]];
    }
    themeElement[state] = value;
    theme.set(customCalculatorTheme);

    return;
}

var option = {
    create : function(title, json, include, required){
        var parsedJSON = json.split(".");
        var themeElement = customCalculatorTheme;
        for(i = 0; i < parsedJSON.length - 1; i++){
            themeElement = themeElement[parsedJSON[i+1]];
        }
        var selector = $('<section><h1>' + title + '</h1></section>').appendTo("#left-container");
        var options = "";

        if(include.indexOf("color") != -1){
            $(this.color(json, required)).appendTo(selector).find("input").val(themeElement.color).spectrum({
                preferredFormat: "hex",
                showInput: true,
                allowEmpty:!required,
                showButtons: false,
                move: function(color) {
                    var color = color + "";
                    changeTheme(json, "color", color);
                },
                change: function(color) {
                    var color = color + "";
                    changeTheme(json, "color", color);
                }
            });
        }

        if(include.indexOf("hover") != -1){
            $(this.hoverColor(json, required)).appendTo(selector).find("input").val(themeElement.hoverColor).spectrum({
                preferredFormat: "hex",
                showInput: true,
                allowEmpty:!required,
                showButtons: false,
                move: function(color) {
                    var color = color + "";
                    changeTheme(json, "hoverColor", color);
                },
                change: function(color) {
                    var color = color + "";
                    changeTheme(json, "hoverColor", color);
                }
            });
        }

        if(include.indexOf("border") != -1){
            $(this.borderColor(json, required)).appendTo(selector).find("input").val(themeElement.borderColor).spectrum({
                preferredFormat: "hex",
                showInput: true,
                allowEmpty:!required,
                showButtons: false,
                move: function(color) {
                    var color = color + "";
                    changeTheme(json, "borderColor", color);
                },
                change: function(color) {
                    var color = color + "";
                    changeTheme(json, "borderColor", color);
                }
            });
        }

        if(include.indexOf("text") != -1){
            $(this.borderColor(json, required)).appendTo(selector).find("input").val(themeElement.textColor).spectrum({
                preferredFormat: "hex",
                showInput: true,
                allowEmpty:!required,
                showButtons: false,
                move: function(color) {
                    var color = color + "";
                    changeTheme(json, "textColor", color);
                },
                change: function(color) {
                    var color = color + "";
                    changeTheme(json, "textColor", color);
                }
            });
        }
    },

    color : function(json, required) {
        if(required === true) return '<div><h3>background color</h3><input type="text" class="color-required"/></div>';
        else return '<div><h3>background color</h3><input type="text" class="color"/></div>';
    },

    hoverColor : function(json, required) {
        if(required === true) return '<div><h3>background color:hover</h3><input type="text" class="color-required"/></div>';
        else return '<div><h3>background color:hover</h3><input type="text" class="color"/></div>';
    },

    borderColor : function(json, required) {
        if(required === true) return '<div><h3>border color</h3><input type="text" class="color-required"/></div>';
        else return '<div><h3>border color</h3><input type="text" class="color"/></div>';
    },

    borderColor : function(json, required) {
        if(required === true) return '<div><h3>text color</h3><input type="text" class="color-required"/></div>';
        else return '<div><h3>border color</h3><input type="text" class="color"/></div>';
    }
}
