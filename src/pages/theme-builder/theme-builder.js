$(document).ready(() => {
    localStorage.theme = 'custom';
    theme.load('custom');
    let customTheme = $.parseJSON(localStorage.customTheme);

    Object.keys(theme.baseTheme)
    .filter(s => s !== 'app')
    .forEach(title => {

        let createOption = (title, selector, selectorTheme, required) => {
            // point and ce are needed
            // for backwards compatability
            title = title.replace(/^point$/, 'decimal');
            title = title.replace(/^ce$/, 'clear');

            title = title.charAt(0).toUpperCase() + title.slice(1);
            $('#left-container').append(`<br><h2>${title}</h2>`);

            Object.keys(selector).forEach(prop => {

                // handle button types
                if(typeof selector[prop] === 'object'){
                    if(typeof selectorTheme[prop] === 'undefined'){
                        selectorTheme[prop] = {};
                    }
                    createOption(prop, selector[prop], selectorTheme[prop], false);
                } 

                else{
                    let $optionGrp = $(`<div class='option-grp'><h3>${prop}</h3></div>`),
                        unit = '',
                        $input;

                    if(/width/i.test(prop)){
                        $input = $(`<input type='range' min='0' max='5'>`);
                        $optionGrp.append($input);
                        $input.on('input', function() {
                            selectorTheme[prop] = $(this).val() + unit;

                            // ensure custom theme selected
                            localStorage.theme = 'custom';
                            localStorage.customTheme = JSON.stringify(customTheme);
                            theme.load('custom');
                        });

                        try{
                            $input.val(String(selectorTheme[prop]).replace(unit, ''));
                        } catch(e){};
                    }

                    else{
                        let colorChange = (value) => {
                            // check for null value
                            if(value) value = `#${value.toHex()}`;
                            
                            selectorTheme[prop] = value;
                            localStorage.theme = 'custom';
                            localStorage.customTheme = JSON.stringify(customTheme);
                            theme.load('custom');
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

                    $('#left-container').append($optionGrp);
                }
            });
        };

        createOption(title, theme.baseTheme[title], customTheme[title], true);
    });
});