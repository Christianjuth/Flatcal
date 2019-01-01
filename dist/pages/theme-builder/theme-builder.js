let options = {
    "body": {
        "color": "color"
    },

    "input": {
        "color": "color",
        "borderColor": "color",
        "textColor": "color"
    },

    "button": {
        "color": "color",
        "borderColor": "color",
        "borderWidth": "number",
        "hoverColor": "color",
        "textColor": "color",

        "numbers": {
            "color": "color",
            "hoverColor": "color",
            "textColor": "color"
        },

        "point": {
            "color": "color",
            "hoverColor": "color",
            "textColor": "color"
        },

        "ce": {
            "color": "color",
            "hoverColor": "color",
            "textColor": "color"
        },

        "positiveNegative": {
            "color": "color",
            "hoverColor": "color",
            "textColor": "color"
        },

        "operators": {
            "color": "color",
            "hoverColor": "color",
            "textColor": "color"
        },

        "percentage": {
            "color": "color",
            "hoverColor": "color",
            "textColor": "color"
        },

        "equal": {
            "color": "color",
            "textColor": "color",
            "hoverColor": "color"
        }
    }
};


$(document).ready(() => {
    localStorage.theme = 'custom';
    let customTheme = theme.load('custom');

    Object.keys(options).forEach(title => {

        let createSelectorOptions = (title, selector, selectorTheme, required) => {
            title = title.charAt(0).toUpperCase() + title.slice(1);
            $('#left-container').append(`<br><h2>${title}</h2>`);

            Object.keys(selector).forEach(prop => {

                // handle button types
                if(typeof selector[prop] === 'object'){
                    if(typeof selectorTheme[prop] === 'undefined'){
                        selectorTheme[prop] = {};
                    }
                    createSelectorOptions(prop, selector[prop], selectorTheme[prop], false);
                } 

                else{
                    let $optionGrp = $(`<div class='option-grp'><h3>${prop}</h3></div>`),
                        unit = '',
                        $input;

                    if(selector[prop] == 'number') unit = 'px';

                    if(selector[prop] === 'color'){
                        let colorChange = (value) => {
                            if(selector[prop] === 'color' && value)
                                value = `#${value.toHex()}`;
                            
                            selectorTheme[prop] = value;
                            localStorage.theme = 'custom';
                            theme.set(customTheme);
                            localStorage.customTheme = JSON.stringify(customTheme);
                        }

                        $input = $(`<input type='text' class='color'>`);
                        $optionGrp.append($input);
                        $input.spectrum({
                            preferredFormat: 'hex',
                            color: selectorTheme[prop],
                            showInput: true,
                            allowEmpty: !required,
                            showButtons: false,
                            move: colorChange,
                            change: colorChange
                        });
                    }

                    else{
                        $input = $(`<input type='${selector[prop]}' min='0' max='5'>`);
                        $optionGrp.append($input);
                        $input.change(function() {
                            selectorTheme[prop] = $(this).val() + unit;

                            // ensure custom theme selected
                            localStorage.theme = 'custom';
                            theme.set(customTheme);
                            localStorage.customTheme = JSON.stringify(customTheme);
                        });

                        try{
                            $input.val(selectorTheme[prop].replace(unit, ''));
                        } catch(e){};
                    }

                    $('#left-container').append($optionGrp);
                }
            });
        };

        createSelectorOptions(title, options[title], customTheme[title], true);
    });
});