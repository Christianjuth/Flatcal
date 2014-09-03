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

    $(document.body).on("click", ".clear-input", function() {
        clear(this);
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

    new Dragdealer('border-radius-slider', {
        animationCallback: function(x, y) {
            $('#border-radius-slider > div').text(Math.round(x * 25));
            $("#border-radius-slider, #border-radius-slider > .handle").css({"border-radius": Math.round(x * 25) / 2});
            changeTheme($('#border-radius-slider').attr("json"), $('#border-radius-slider').attr("state"), Math.round(x * 25));
            theme.set(customCalculatorTheme);
        },
        x: customCalculatorTheme.button.borderRadius / 25
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
});

//functions
function clear(element) {
    $(element).parent().children("input").val("");
    $(element).parent().children("input").css({"background-color":"#fff"});
    jsonTheme = $(element).parent().children("input").attr("json");
    state = $(element).parent().children("input").attr("state");

    jsonTheme = jsonTheme.split(".");

    if(jsonTheme.length == 2){
        customCalculatorTheme[jsonTheme[0]][jsonTheme[1]][state] = "";
    }

    else{
        customCalculatorTheme[jsonTheme[0]][state] = "";
    }

    theme.set(customCalculatorTheme);
    return;
}

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
    $(".button").unbind("mouseover").unbind("mouseout");

    jsonTheme = jsonTheme.split(".");

    if(jsonTheme.length == 2){
        customCalculatorTheme[jsonTheme[0]][jsonTheme[1]][state] = value;
    }

    else{
        customCalculatorTheme[jsonTheme[0]][state] = value;
    }

    theme.set(customCalculatorTheme);
    return;
}
