var loadedTheme = "google";
var enable = "all";

$(document).ready(function() {
    progressJs().start();
    $.getJSON(chrome.extension.getURL('resources/themes/themes-list.json'), function(options) {
        options.sort(theme.sort.reverse);

        for(i = 0; i < options.length; i++){
            var name = capitalize(options[i].name).replace(/-/," ");
            var value = options[i].name.toLocaleLowerCase();
            $('<option class="theme-selctor-option" value="' + value + '">' + name + '&#174;</option>').prependTo("#theme-selctor");
        };

        progressJs().end();
    });

    $("#number-container").css({"display":"inline-block"});
    $("#input-container").css({"width":"183px", "padding-right":"8px"});
    $(".input-text").hide();
    $("#margins").css({"margin-left":"108px"});

    tutorial();

    $('input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-grey checkbox',
        increaseArea: '20%' // optional
    }).on('ifToggled', function(event){
        if($('#scientific').find("input").prop('checked') != false){
            scientific(true);
        }

        else{
            scientific(false);
        }
    });

    $("#theme-selctor").chosen({disable_search_threshold: 10});

    $("#theme-selctor").change(function() {
        loadTheme($("#theme-selctor").val());
        return;
    });

    myLibrary("#theme-builder-container").center();
});

function tutorial() {
    var show = {ready: true, event: ''};
    var style = {classes: 'qtip-tipsy'};
    var position = { effect: function(api, pos, viewport) { $(this).animate(pos, { duration: 0, queue: false }); }, my: 'center left', at: 'center right'}
    var step = new Array();

    step[1] = function() {
        var animateTheme = true;
        var themes = theme.get();
        themes.sort();
        var themeNumb = 0;

        for(i = 0; i < 10000; i ++){
            setTimeout(function() {
                if(animateTheme == true){
                    $(".button").unbind("mouseover").unbind("mouseout");
                    if(themeNumb > themes.length - 1) themeNumb = 0;

                    var number = Math.floor((Math.random() * (themes.length - themeNumb - 1) + 1));
                    themeNumb = themeNumb + number;

                    loadedTheme = themes[themeNumb - 1];
                    loadTheme(loadedTheme);
                }
            }, i * 150);
        }

        Alert("Calculator 2.0!", "It is finally here. More power. More customization. But same elegance. ", function() {
            animateTheme = false;
            $('#theme-selctor').val(loadedTheme).trigger("chosen:updated");

            step[2]();
        });
    }

    step[2] = function() {
        Alert("What is new?", "Try this little demo and see what sets us apart. Try the calculator itself in the left, and change the options in the right. When you are ready, click next to continue.", function() {
            animateTheme = false;
            $('#theme-selctor').val(loadedTheme).trigger("chosen:updated");

            $("#next").unbind().click(function() {
                step[3]();
            });
        });
    }

    step[3] = function() {
        if(window.navigator.platform.toLowerCase().indexOf("mac") != -1){
            Alert("Copy and paste?", "Type a number. Click 'Command C' to copy, and 'Command V' to paste.", function() {
                $("#next").unbind().click(function() {
                    step[4]();
                });
            });
        }

        else{
            Alert("Copy and paste?", "Type a number. Click 'Control C' to copy, and 'Control V' to paste.", function() {
                $("#next").unbind().click(function() {
                    step[4]();
                });
            });
        }
    }

    step[4] = function() {
        if(window.navigator.platform.toLowerCase().indexOf("mac") != -1){
            Alert("Keyboard Shortcuts!", "Try clicking 'Option C'. Once you see the popup you can control it with your number keys and plus, minus, etc. If Option C does not bring up the calculator you may need to delete and reinstall this extension due to a bug in Chrome. We apologize for the inconvenience...", function() {
                $("#next").unbind().click(function() {
                    step[5]();
                });
            });
        }

        else{
            Alert("Keyboard Shortcuts!", 'Try clicking "Alt C". Once you see the popup you can control it with your number keys and plus, minus, etc. If Alt C does not bring up the calculator you may need to delete and reinstall this extension due to a bug in Chrome. We apologize for the inconvenience...', function() {
                $("#next").unbind().click(function() {
                    step[5]();
                });
            });
        }
    }

    step[5] = function() {
        setTimeout(function() {
            Alert("You have finished the tutorial!", "Please feel free to contact me at juth.dev@gmail.com. I am looking for testers and more help. You will now be redirected to our settings page.", function() {
                localStorage.tutorial = true;
                window.open ('../settings/options/options.html','_self',false);
            });
        }, 500);
    }

    step[1]();
}

function scientific(toggle, callback) {
    Clear();

    $('#scientific').children(".checkbox").iCheck('disable');

    if(toggle == true){
        $("#input-container").animate({"width":"390px", "padding-right":"11px"}, 300, "linear", function() {
            $("#scientific-container").fadeIn(300);
            if(callback != undefined){
                callback();
            }
            $('#scientific').children(".checkbox").iCheck('enable');
            return;
        });

        $("#margins").animate({"margin-left":"0px"}, 300, "linear");
    } else {
        $("#scientific-container").fadeOut(200, function() {
            $("#margins").animate({"margin-left":"108px"}, 300, "linear");
            $("#input-container").animate({"width":"187px", "padding-right":"8px"}, 300, "linear", function() {
                if(callback != undefined){
                    callback();
                }
                $('#scientific').children(".checkbox").iCheck('enable');
                return;
            });
        });
    }
}

function animatedShadow(selector) {
    var elm = $(selector),
        x = ~Math.round((0 - $(elm).offset().left - ($(elm).outerWidth() / 2) - 150) / 175 - 14),
        y = ~Math.round((0 - $(elm).offset().top - ($(elm).outerHeight() / 2) - 150) / 175 - 13),
        cssVal = x+'px '+y+'px 2px #ddd';
    elm.css({'-webkit-box-shadow' : cssVal, 'box-shadow' : cssVal });

    $(document).on('mousemove', function(e) {
        var elm = $(selector),
            x = ~Math.round((e.pageX - $(elm).offset().left - ($(elm).outerWidth() / 2) - 150) / 175 - 15),
            y = ~Math.round((e.pageY - $(elm).offset().top - ($(elm).outerHeight() / 2) - 150) / 175 - 14),
            cssVal = x+'px '+y+'px 2px #ddd';
        elm.css({'-webkit-box-shadow' : cssVal, 'box-shadow' : cssVal });
    });

    window.onbeforeunload(function() {
        localStorage.tutorial = true;
    });
}

function loadTheme(name){
    var filename = chrome.extension.getURL("resources/themes/" + name + ".json");
    $.getJSON(filename, function(json){
        theme.load(json);
    });
}

window.Alert = function(content, title, effect) {
    var message = $('<p />', { text: title }),
        ok = $('<button />', { text: 'Ok', 'class': 'full' });

    dialogue( message.add(ok), content, effect);
}

function dialogue(content, title, effect) {
    $('<div />').qtip({
        content: {
            text: content,
            title: title
        },
        position: {
            my: 'center', at: 'center',
            target: $(window)
        },
        show: {
            ready: true,
            modal: {
                on: true,
                blur: false
            }
        },
        hide: {
            effect: effect
        },
        style: {
            type:'dialogue',
            classes: 'qtip-bootstrap'
        },
        events: {
            render: function(event, api) {
                $('button', api.elements.content).click(function(e) {
                    api.hide(e);
                });
            },
            hide: function(event, api) { api.destroy(); }
        }
    });
}

option = {
    defineCheck : function(option, storage, watch, ifTrue, ifFalse){
        if(ifTrue == undefined) ifTrue = function(){}; //make sure ifTrue defined
        if(ifFalse == undefined) ifFalse = function(){}; //make sure ifFalse defined
        option = $(option); //get selector
        if(localStorage[storage] == "true"){ //check true
            option.find("input").prop('checked', true); //check
            ifTrue(); //call ifTrue
        }

        else{
            option.find("input").prop('checked', false); //uncheck
            ifFalse(); //call ifFalse
        }

        option.iCheck({
            checkboxClass: 'icheckbox_square-grey checkbox',
            increaseArea: '20%' // optional
        }).on('ifToggled', function(event){
            if(option.find("input").prop('checked') != false){ //check true
                localStorage[storage] = "true"; //update option localStorage true
                ifTrue(); //call ifTrue
            }

            else{
                localStorage[storage] = "false"; //update option localStorage false
                ifFalse(); //call ifFalse
            }
        });

        if(watch == true){
            this.watch(storage, 500, function(object){ //watch localStorage object
                object.defineCheck(option, storage, false, ifTrue, ifFalse); //on chagne refresh option
            });
        }
    },

    dissableCheck : function(option){
        option = $(option); //get selector
        $(option).fadeTo(100, 0.4, function() { //fade option
            $(option).children(".checkbox").iCheck('disable'); //disable check box
        });
    },

    enableCheck : function(option){
        option = $(option); //get selector
        $(option).fadeTo(100, 1, function() { //fade option
            $(option).children(".checkbox").iCheck('enable'); //enable check box
        });
    },

    defineSelect : function(option, storage, watch, change){
        option = $(option); //get selector
        option.val(localStorage[storage]); //get setting from localStorage
        option.chosen({disable_search_threshold: 10}); //set up chosen
        option.trigger("chosen:updated"); //refresh chosen

        change(); //call change
        option.change(function() { //on option change
            localStorage[storage] = option.val(); //update local storage
            change(); //call change
        });

        if(watch == true){ //if first iteration of defineSelect
            this.watch(storage, 1000, function(object){ //watch localStorage object
                object.defineSelect(option, storage, false, change); //on chagne refresh option
            });
        }
    },

    watch : function(storage, refresh, callback){
        var value = localStorage[storage]; //get valuse from localStorage
        setTimeout(function(storage, refresh, callback, value, restart){ //timeout
            if(localStorage[storage] != value) callback(restart); //check for storage value change
            restart.watch(storage, refresh, callback); //recall watch
        }, refresh, storage, refresh, callback, value, this);
    }
}

function capitalize( str ){
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}
