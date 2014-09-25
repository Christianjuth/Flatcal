var loadedTheme = "google";
var enable = "all";
localStorage.tutorial = true;

$(document).ready(function() {
    myLibrary("#theme-builder-container").center();
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
        theme.load($("#theme-selctor").val());
        return;
    });
});

function tutorial() {
    var show = {ready: true, event: ''};
    var style = {classes: 'qtip-tipsy'};
    var position = { effect: function(api, pos, viewport) { $(this).animate(pos, { duration: 0, queue: false }); }, my: 'center left', at: 'center right'}
    var step = new Array();

    step[1] = function() {
        analyticsEvent("tutorial", "20%"); //analytics start
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
                    theme.load(loadedTheme);
                }
            }, i * 150);
        }

        Alert("Why a Calculator?", "Don't reinvent the wheel, just realign it. \n ~Anthony J. D'Angelo", function() {
            $('#theme-selctor').val(loadedTheme).trigger("chosen:updated");
            animateTheme = false;
            step[2]();
        });
    }

    step[2] = function() {
        analyticsEvent("tutorial", "40%");
        Alert("What makes us diffrent?", "Try this little demo and see what sets us apart. Try the calculator on the left, and the options on the right.", function() {
            animateTheme = false;
            $('#theme-selctor').val(loadedTheme).trigger("chosen:updated");

            $("#next").unbind().click(function() {
                step[3]();
            });
        });
    }

    step[3] = function() {
        analyticsEvent("tutorial", "60%");
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
        analyticsEvent("tutorial", "80%");
        if(window.navigator.platform.toLowerCase().indexOf("mac") != -1){
            Alert("Keyboard Shortcuts!", "Try clicking 'Option C'. Once you see the popup you can control it with your number keys, plus, minus, etc.", function() {
                $("#next").unbind().click(function() {
                    step[5]();
                });
            });
        }

        else{
            Alert("Keyboard Shortcuts!", 'Try clicking "Alt C". Once you see the popup you can control it with your number keys, plus, minus, etc.', function() {
                $("#next").unbind().click(function() {
                    step[5]();
                });
            });
        }
    }

    step[5] = function() {
        analyticsEvent("tutorial", "100%");
        setTimeout(function() {
            Alert("You have finished the tutorial!", "You will be redirected to our settings page.", function() {
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
