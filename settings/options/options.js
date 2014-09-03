$(document).ready(function() {
    progressJs().start();
    $("#theme-selctor").chosen({disable_search_threshold: 10});

    $.getJSON(chrome.extension.getURL('resources/themes/themes-list.json'), function(options) {
        options.sort(theme.sort.reverse);

        for(i = 0; i < options.length; i++){
            var name = capitalize(options[i].name).replace(/-/," ");
            var value = options[i].name.toLocaleLowerCase();
            $('<option class="theme-selctor-option" value="' + value + '">' + name + '&#174;</option>').prependTo("#theme-selctor");
        };

        option.defineSelect("#theme-selctor", "theme", true, function(){
            if(localStorage.theme == "custom"){
                customTheme(true);
            }

            else{
                customTheme(false);
            }
        });

        progressJs().end();
    });

    option.defineCheck('#scientific', 'scientific', true);
    option.defineCheck('#dissable-notify-delay', 'noNotifyDelay', true);
    option.defineCheck('#only-important-notify', 'limitNotifications', true);

    option.defineCheck('#screen-only', 'screenOnly', true, function(){
        option.dissableCheck('#scientific');
    }, function() {
        option.enableCheck('#scientific');
    });

    document.getElementById('theme-file-upload').addEventListener('change', readFile, false);

    $("#save-current-theme").click(function() {
        theme.save(jQuery.parseJSON(localStorage.customTheme));
    });

    //------------------------------dev------------------------------//
    option.defineCheck("#dissable-analytics", "dev", true);
    $("#reset-localStorage").find("a").click(function(){
        storage.resetAll()
    });

    $("h1").click(function() {
        if(tenClick() == true){
            if(localStorage.dev != "true"){
                _gaq.push(['_trackEvent', "dev-center" , 'clicked']);
            }
            $(".lightbox").unbind();
            $(".lightbox, .popup").show();
            myLibrary(".popup").center();
            setTimeout(function(){
                $(".lightbox").click(function() {
                    $(".lightbox, .popup").hide();
                });
            }, 300);
        }
    });

    //-----------------------------changelog-----------------------------//
    $.getJSON("https://raw.githubusercontent.com/Christianjuth/calculator-browser-extension/JSON/changelog.json", function(data) {
        for(i=0; i< Math.min(data.length, 3); i++){
            line = data[i];

            if(i == 0){
                changelogLine(line);
            }

            else{
                changelogLine(line);
            }
        };
    });
});

var numClick = 1;
function tenClick(){
    if(numClick == 10){
        numClick = 1;
        return true;
    }
    else{
        numClick = numClick + 1;
        if(numClick == 2){
            setTimeout(function(){
                if(numClick != 1){
                    numClick = 1;
                }
            },2000);
        }

        return false;
    }
}

function readFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function() {
        if(validateTheme($.parseJSON(this.result))){
            theme.update($.parseJSON(this.result));
        }

        else(Alert("Error!", "invalid theme"));
    }
    reader.readAsText(file);
    return;
}

function customTheme(animate) {
    if($("#theme-selctor").val() == "custom"){
        $("#custom-themes").fadeIn();
    }
    else{
        if(animate == true) $("#custom-themes").fadeOut();
        else $("#custom-themes").hide();
    }
    return;
}

function changelogLine(options){
    var d = new Date(options.date.replace(/-/,"/"));
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var m = month[d.getMonth()];
    var day = d.getUTCDate();
    var y = d.getFullYear();

    $("<tr><td><a href='" + options.link + "'>" + options.version + "</a></td><td>" + options.description + "</td><td>" + m + "-" + day + "-" + y + "</td></tr>").appendTo("table");
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

        option.trigger("chosen:updated");
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
    for( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
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
