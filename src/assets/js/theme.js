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

function ajaxGetFile(file, type) {
    let dataOut = false;
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


let theme = {
    ini: function(theme) {
        this.load(theme);
    },

    load: function(json) {
        if(typeof json === "string"){
            json = theme.get(json);
        }
        if(json == false){
            delete localStorage.theme;
            location.reload();
        }
        injectCSS(baseTheme);
        injectCSS(json);
        return json;
    },

    set: function(json){
        if(typeof json === "string") json = this.get(json);
        injectCSS(json);
    },

    get: function(name){
        let out;

        if(typeof name === 'undefined'){
            let data = ajaxGetFile("../../assets/themes/themes-list.json", "json");
            out = data.map(theme => {
                return theme.toLowerCase();
            });
        }

        // load custom theme
        else if(name === 'custom'){
            try{
                out = jQuery.parseJSON(localStorage.customTheme); 
            } catch(e){
                delete localStorage.customTheme;
                setTimeout(() => location.reload(), 500);
            }
            
            out = $.extend(true, {}, baseTheme, out),
            // force app background-color
            out.app.color = 'linear-gradient(to left bottom, rgb(158, 158, 158), rgb(54, 55, 56))';
        }

        else{
            out = ajaxGetFile("../../assets/themes/" + name + ".json", "json");
        }

        return out;
    },

    getCurrent: function(){
        if(localStorage.theme != "custom"){
            return localStorage.theme;
        }

        else{
            return $.parseJSON(localStorage.customTheme).manifest.name;
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

        '#point': {
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
        $selector.unbind();
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
