let theme = {
    baseTheme: {
        'app': {
            'color': ''
        },

        'body': {
            'color': ''
        },

        'input': {
            'color': '',
            'borderColor': '',
            'outlineColor': '',
            'textColor': ''
        },

        'button': {
            'color': '',
            'borderColor': '',
            'borderWidth': '',
            'hoverColor': '',
            'textColor':'',

            'numbers': {
                'color': '',
                'hoverColor': '',
                'textColor': ''
            },

            'point': {
                'color': '',
                'hoverColor': '',
                'textColor': ''
            },

            'ce': {
                'color': '',
                'hoverColor': '',
                'textColor': ''
            },

            'operators': {
                'color': '',
                'hoverColor': '',
                'textColor': ''
            },

            'equal': {
                'color': '',
                'textColor': '',
                'hoverColor': ''
            }
        }
    },

    load: function(name) {   

        let inject = (json) => {
            this.injectCSS(this.baseTheme);
            this.injectCSS(json);
        };

        if(name === 'custom'){
            let customTheme = $.parseJSON(localStorage.customTheme);
            customTheme.app = customTheme.app || {};
            customTheme.app.color = 'linear-gradient(to left bottom, rgb(158, 158, 158), rgb(54, 55, 56))';
            inject(customTheme);
        }
        
        else{
            $.ajax({
                method: 'get',
                url: `/assets/themes/${name}.json`,
                dataType: 'json',
                success: (json) => inject(json),
                error: () => {
                    delete localStorage.theme;
                    location.reload();
                }
            });
        }
    },

    getCurrent: () => {
        if(localStorage.theme != 'custom')
            return localStorage.theme;

        else
            return $.parseJSON(localStorage.customTheme).manifest.name;
    },

    injectCSS: function(json) {

        let theme = $.extend(true, {}, this.baseTheme, json),
            button = theme.button;

        let mappings = {
            'body': {
                'background': !window.locationbar.visible ? theme.body.color : theme.app.color
            },

            '.calculator-mask': {
                'background': theme.app.color
            },

            '.calculator': {
                'background': theme.body.color
            },

            '.input-wrap': {
                'background': theme.input.color,
                'border-color': theme.input.borderColor,
                'color': theme.input.textColor
            },

            '.input-border': {
                'background': theme.input.outlineColor || theme.input.color
            },

            '.button': {
                'background': button.color,
                'backgroundHover': button.hoverColor,
                'color': button.textColor,
                'outline-color': theme.body.color,
                'outline-width': `${parseInt(button.borderWidth)}px`,
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

            '#ce': {
                'background': button.ce.color,
                'backgroundHover': button.ce.hoverColor,
                'color': button.ce.textColor
            },

            '.op': {
                'background': button.operators.color,
                'backgroundHover': button.operators.hoverColor,
                'color': button.operators.textColor
            },

            '.equal': {
                'background': button.equal.color,
                'backgroundHover': button.equal.hoverColor,
                'color': button.equal.textColor
            }

        };

        // selectors
        $('.button').unbind();
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
            }
            $selector.mouseout(function() {
                $(this).css({background: css.background});
            });
        });
    }
};





$(document).ready(function() {

    //appends the overlay to each button
    $('.calculator .button').each(function() {
        let $this = $(this);
        $this.append('<div class="ripple"></div>');
    });

    $(document).on('click', '.button', function (e) {
        let $clicked = $(this);

        //gets the clicked coordinates
        let offset = $clicked.offset();
        let relativeX = (e.pageX - offset.left);
        let relativeY = (e.pageY - offset.top);
        let width = $clicked.width();

        let $ripple = $clicked.find('.ripple');

        //puts the ripple in the clicked coordinates without animation
        $ripple.addClass('notransition');
        $ripple.css({
            'top': relativeY,
            'left': relativeX
        });
        $ripple[0].offsetHeight;
        $ripple.removeClass('notransition');

        //animates the button and the ripple
        $clicked.addClass('hovered');
        $ripple.css({
            'width': width * 2,
            'height': width * 2,
            'margin-left': -width,
            'margin-top': -width
        });

        setTimeout(function() {
            //resets the overlay and button
            $ripple.addClass('notransition');
            $ripple.attr('style', '');
            $ripple[0].offsetHeight;
            $clicked.removeClass('hovered');
            $ripple.removeClass('notransition');
        }, 300);
    });
});
