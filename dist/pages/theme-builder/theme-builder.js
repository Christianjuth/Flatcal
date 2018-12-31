var customCalculatorTheme = jQuery.parseJSON(localStorage.customTheme);
$(document).ready(function() {
    myLibrary('#theme-builder-container').center()
    theme.set(customCalculatorTheme);

    $(document.body).on("click", "#save", function() {
        theme.save(localStorage.customTheme);
    });

    $("#scientific-1").css({"display":"inline-block"});
    $("#number-container").css({"display":"inline-block"});
    $("#margins").css({"padding":"16px"});

    $("#left-container").scroll(function() {
        $("*").spectrum("hide");
    });

    themebuilder.option.create("name","json.manifest","name",true);
    themebuilder.option.create("body","json.body","color",true);
    themebuilder.option.create("screen-border","json.input","outline",false);
    themebuilder.option.create("screen","json.input","colortextborder",true);
    themebuilder.option.create("buttons","json.button","colorhovertextsize",true);
    themebuilder.option.create("numbers","json.button.numbers","colorhovertext",false);
    themebuilder.option.create("operators","json.button.operators","colorhovertext",false);
    themebuilder.option.create("ce button","json.button.ce","colorhovertext",false);
    themebuilder.option.create("equal button","json.button.equal","colorhovertext",false);
    themebuilder.option.create("+/- button","json.button.positiveNegative","colorhovertext",false);
    themebuilder.option.create("percentage","json.button.percentage","colorhovertext",false);
    themebuilder.option.create("decimal button","json.button.point","colorhovertext",false);

    section = 1;
    $(".2x").click(function() {
        if(section == 1){
            $("#scientific-1").hide();
            $("#scientific-2").show();
            section = 2;
        }

        else{
            $("#scientific-2").hide();
            $("#scientific-1").show();
            section = 1;
        }
    });
});

var themebuilder = {
    option : {
        create : function(title, json, include, required){
            var parsedJSON = json.split(".");
            var themeElement = customCalculatorTheme;
            for(i = 0; i < parsedJSON.length - 1; i++){
                if(typeof themeElement[parsedJSON[i+1]] !== "undefined"){
                    themeElement = themeElement[parsedJSON[i+1]];
                }

                else{
                    themeElement[parsedJSON[i+1]] = {};
                    themeElement = themeElement[parsedJSON[i+1]];
                }
            }

            var selector = $('<section><h1>' + title + '</h1></section>').appendTo("#left-container");

            if(include.indexOf("color") != -1){
                $(this.color()).appendTo(selector).find("input").val(themeElement.color).spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    allowEmpty:!required,
                    showButtons: false,
                    move: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "color", color);
                    },
                    change: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "color", color);
                    }
                });
            }

            if(include.indexOf("hover") != -1){
                $(this.hoverColor()).appendTo(selector).find("input").val(themeElement.hoverColor).spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    allowEmpty:!required,
                    showButtons: false,
                    move: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "hoverColor", color);
                    },
                    change: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "hoverColor", color);
                    }
                });
            }

            if(include.indexOf("border") != -1){
                $(this.outlineColor()).appendTo(selector).find("input").val(themeElement.borderColor).spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    allowEmpty:!required,
                    showButtons: false,
                    move: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "borderColor", color);
                    },
                    change: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "borderColor", color);
                    }
                });
            }

            if(include.indexOf("outline") != -1){
                $(this.borderColor()).appendTo(selector).find("input").val(themeElement.outlineColor).spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    allowEmpty:!required,
                    showButtons: false,
                    move: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "outlineColor", color);
                    },
                    change: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "outlineColor", color);
                    }
                });
            }

            if(include.indexOf("borderWidth") != -1 || include.indexOf("size") != -1){
                $(this.borderWidth()).appendTo(selector).find(".slider").sGlide({
                    startAt: themeElement.borderWidth * (100 / 5),
                    pill: false,
                    width: 125,
                    height: 28,
                    unit : 'px',
                    drag: function(o){
                        var pct = Math.round(5 * (o.value * 0.01));
                        themebuilder.updateTheme(json, "borderWidth", pct);
                    }
                });
            }

            if(include.indexOf("text") != -1){
                $(this.textColor()).appendTo(selector).find("input").val(themeElement.textColor).spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    allowEmpty:!required,
                    showButtons: false,
                    move: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "textColor", color);
                    },
                    change: function(color) {
                        var color = color + "";
                        themebuilder.updateTheme(json, "textColor", color);
                    }
                });
            }

            if(include.indexOf("font") != -1){
                $(this.font()).appendTo(selector).find(".selector").val(themeElement.font).change(function() {
                    themebuilder.updateTheme(json, "font", $(this).val());
                    theme.set(customCalculatorTheme);
                }).chosen({disable_search_threshold: 10});
            }

            if(include.indexOf("name") != -1){
                $(this.name()).appendTo(selector).val(themeElement.name).change(function() {
                    themebuilder.updateTheme(json, "name", $(this).val());
                });
            }
        },

        name : function() {
            return '<input type="text" class="text" placeholder="untitled"/>';
        },

        color : function() {
            return '<div><h3>background color</h3><input type="text" class="color"/></div>';
        },

        hoverColor : function() {
            return '<div><h3>background color:hover</h3><input type="text" class="color"/></div>';
        },

        outlineColor : function() {
            return '<div><h3>color</h3><input type="text" class="color"/></div>';
        },

        borderColor : function() {
            return '<div><h3>border color</h3><input type="text" class="color"/></div>';
        },

        borderWidth : function() {
            return '<div><h3>outline width</h3><div class="slider"></div></div>';
        },

        textColor : function() {
            return '<div><h3>text color</h3><input type="text" class="color"/></div>';
        },

        font : function() {
            var selector = $('<div><h3>font</h3><select class="selector"></select></div>');
            var fonts = ["arial","digital","helvetica","san-serif"];
            for(i = 0; i < fonts.length; i++){
                selector.find(".selector").append('<option value="' + fonts[i] + '">' + fonts[i] + '</option>');
            }
            return selector;
        }
    },

    updateTheme : function(jsonTheme, state, value) {
        var parsedJSON = jsonTheme.split(".");
        var themeElement = customCalculatorTheme;
        for(i = 0; i < parsedJSON.length - 1; i++){
            themeElement = themeElement[parsedJSON[i+1]];
        }
        if(typeof themeElement !== "undefined"){
            themeElement[state] = value;
            theme.set(customCalculatorTheme);
        }

        return;
    }
}
