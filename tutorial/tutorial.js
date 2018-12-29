var loadedTheme = "google";
var enable = "all";
localStorage.tutorial = true;

$(document).ready(function() {

    $.getJSON(chrome.extension.getURL('resources/themes/themes.json'), function(options) {
        options.sort();

        options.forEach((option) => {

            // convert theme-name to "Theme Name"
            let name = option.split('-').map((w) => {
                return w.charAt(0).toUpperCase() + w.slice(1);
            }).join(' ');

            let file = option.toLowerCase();

            $(`<option class="theme-selctor-option" value="${file}">${name}</option>`).prependTo("#theme-selctor");
        });


        $("#theme-selctor").val('google');
        theme.load('google');
        $("#theme-selctor").change(() => {
            theme.load($("#theme-selctor").val());
        });
    });


    $("#number-container").css({"display":"inline-block"});
    $(".input-text").hide();
    $("#margins").css({"margin-left":"108px"});


    $('#calculator-type').change(function() { //on option change
        calculator.screen.clear();

        if($(this).val() == "scientific"){

            $("#margins").animate({
                'margin-left': '0px',
                'width': '435px'
            }, 300, "linear", () => {
                $("#scientific-1, #input-container > .text").fadeIn(300);
            });
        }

        else {
            $("#scientific-1, #input-container > .text").fadeOut(300, () => {
                $("#margins").animate({
                    'margin-left': '108px',
                    'width': '229px'
                }, 300, "linear");
            });
        }
    });

    $("#scientific-1, #input-container > .text").hide();
    $("#margins").css({"margin-left":"108px"});

    $('#calculator-type').val("normal");



    calculator.ini({
        storage : "localStorage",
        selector : {
            screen : "#input",
            radDeg : "#rad-deg",
            radDegInvert : "#rad-deg-invert"
        },
        options: {
            log : true
        },
        max : 15
    });
});





let option = {
    defineCheck: function(selector, storage, onChange){
        $selector = $(selector); //get selector
        if(localStorage[storage] == "true"){ //check true
            $selector.find("input").prop('checked', true); //check
            ifTrue(); //call ifTrue
        }

        else{
            option.find("input").prop('checked', false); //uncheck
            ifFalse(); //call ifFalse
        }
    },
    defineSelect: function(selector, storage, onChange){
        let $selector = $(selector); //get selector
        $selector.val(localStorage[storage]); //get setting from localStorage

        onChange();
        $selector.change(() => {
            localStorage[storage] = $selector.val();
            onChange();
        });
    }
}
