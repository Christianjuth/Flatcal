function ajaxGetFile(file, type) {
    var dataOut = false;
    $.ajax({
        url: file,
        async: false,
        dataType: type,
        tryCount : 0,
        retryLimit : 15,
        success: (data) => {
            dataOut = data;
        },
        error: () => {}
    });

    return dataOut;
}


var theme = {
    ini: function(theme) {
        this.load(theme);
    },

    load: function(json) {
        if(typeof json === "string"){
            json = theme.get(json);
        }
        if(json == false){
            localStorage.theme = "google";
            json = theme.get("google");
        }
        injectCSS(json);
    },

    set: function(json){
        if(typeof json === "string") json = this.get(json);
        theme.update(json)
        injectCSS(json);
        return;
    },

    get: function(name){
        var themesOut = null;
        if(name == undefined){
            themesOut = [];
            data = ajaxGetFile("../../assets/themes/themes-list.json", "json");
            for(i = 0; i < data.length; i++){
                themesOut.push(data[i].toLowerCase());
            };
        }

        else{
            themesOut = [];
            data = ajaxGetFile("../../assets/themes/" + name + ".json", "json");
            themesOut = data;
        }

        return themesOut;
    },

    getCurrent: function(){
        if(localStorage.theme != "custom"){
            return localStorage.theme;
        }

        else{
            return $.parseJSON(localStorage.customTheme).manifest.name;
        }
    },

    save: function(json) {
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

    update: function(json) {
        localStorage.theme = "custom";

        localStorage.customTheme = JSON.stringify(json);
        customCalculatorTheme = jQuery.parseJSON(localStorage.customTheme);
    },

    sort: {
        foward: function(a,b){
            if(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase())return false;
            if(a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase())return true;
            return false;
        },

        reverse: function(a,b){
            if(a.toLocaleLowerCase() < b.toLocaleLowerCase()) return true;
            if(a.toLocaleLowerCase() > b.toLocaleLowerCase()) return false;
        }
    },

    reconstruct: function(theme){
        var settings = [];

        for(i = 0; i < settings.length; i++){
            if(arguments[0]);
        }
    }
}


let baseTheme = {
    "app": {
        "color": ""
    },

    "body": {
        "color": ""
    },

    "input": {
        "color": "",
        "borderColor": "",
        "textColor": ""
    },

    "button": {
        "color": "",
        "borderColor": "",
        "borderRadius": "",
        "borderWidth": "",
        "hoverColor": "",
        "textColor":"",

        "numbers": {
            "color": "",
            "hoverColor": "",
            "textColor": ""
        },

        "point": {
            "color": "",
            "hoverColor": "",
            "textColor": ""
        },

        "ce": {
            "color": "",
            "hoverColor": "",
            "textColor": ""
        },

        "positiveNegative": {
            "color": "",
            "hoverColor": "",
            "textColor": ""
        },

        "operators": {
            "textColor": ""
        },

        "percentage": {
            "color": "",
            "hoverColor": "",
            "textColor": ""
        },

        "equal": {
            "color": "",
            "textColor": "",
            "hoverColor": ""
        }
    }
};

let injectCSS = (json) => {

    let theme = $.extend(true, {}, baseTheme, json),
        button = theme.button;

    let mappings = {
        'body': {
            'background': theme.app.color
        },

        '.calculator': {
            'background': theme.body.color
        },

        '#input-container': {
            'background': theme.input.color,
            'border-color': theme.input.borderColor,
            'color': theme.input.textColor
        },

        '#input-border': {
            'background': theme.input.outlineColor || theme.input.color
        },

        '.button': {
            'background': button.color,
            'backgroundHover': button.hoverColor,
            'color': button.textColor,
            'outline-color': theme.body.color,
            'outline-width': `${button.borderWidth}`,
            'outline-offset': `${-(parseInt(button.borderWidth) - 1)}px`
        },

        '.number': {
            'background': button.numbers.color,
            'backgroundHover': button.numbers.hoverColor,
            'color': button.numbers.textColor
        },

        '.decimal': {
            'background': button.point.color,
            'backgroundHover': button.point.hoverColor,
            'color': button.point.textColor
        },

        '#percentage': {
            'background': button.percentage.color,
            'backgroundHover': button.percentage.hoverColor,
            'color': button.percentage.textColor
        },

        '#ce': {
            'background': button.ce.color,
            'backgroundHover': button.ce.hoverColor,
            'color': button.ce.textColor
        },

        '#positive-negative': {
            'background': button.positiveNegative.color,
            'backgroundHover': button.positiveNegative.hoverColor,
            'color': button.positiveNegative.textColor
        },

        '.main-op': {
            'background': button.operators.color,
            'backgroundHover': button.operators.hoverColor,
            'color': button.operators.textColor
        },

        '#equal': {
            'background': button.equal.color,
            'backgroundHover': button.equal.hoverColor,
            'color': button.equal.textColor
        }

    };

    // selectors
    Object.keys(mappings).forEach(selector => {
        let css = mappings[selector],
            $selector = $(selector);

        // perge blank strings
        Object.keys(css).forEach(key => {
            if(css[key] === '') css[key] = null;
        });

        // inject main css
        $selector.css(css);

        // check if backgorundHover exsists
        if(![null, ''].includes(css.backgroundHover)){
            $selector.mouseover(function() {
                $(this).css({background: css.backgroundHover});
            });
            $selector.mouseout(function() {
                $(this).css({background: css.background});
            });
        }
    });

};





$(document).ready(function() {

    //appends the overlay to each button
    $('.calculator .button').each(function() {
        let $this = $(this);
        $this.append("<div class='ripple'></div>");
    });

    $(document).on("click", ".button", function (e) {
        let $clicked = $(this);

        //gets the clicked coordinates
        let offset = $clicked.offset();
        let relativeX = (e.pageX - offset.left);
        let relativeY = (e.pageY - offset.top);
        let width = $clicked.width();

        let $ripple = $clicked.find('.ripple');

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
});
