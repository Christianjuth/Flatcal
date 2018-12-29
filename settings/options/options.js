localStorage.tutorial = true;
$(document).ready(function() {

    $.getJSON(chrome.extension.getURL('resources/themes/themes.json'), function(options) {
        options.sort(theme.sort.reverse);

        options.forEach((option) => {

            // convert theme-name to "Theme Name"
            let name = option.split('-').map((w) => {
                return w.charAt(0).toUpperCase() + w.slice(1);
            }).join(' ');

            let file = option.toLowerCase();

            $(`<option class="theme-selctor-option" value="${file}">${name}</option>`).prependTo("#theme-selctor");
        });

        option.defineSelect("#theme-selctor", "theme", () => {
            customTheme(localStorage.theme == "custom");
        });
    });

    option.defineSelect("#calculator-type", "type", () => {});


    document.getElementById('theme-file-upload').addEventListener('change', () => {
        let file = evt.target.files[0];
        let reader = new FileReader();
        reader.onload = function() {
            if(theme.validate($.parseJSON(this.result))){
                theme.update($.parseJSON(this.result));
                Alert("Success!", "theme updated")
            }

            else(Alert("Error!", "invalid theme"));
        }
        reader.readAsText(file);
    }, false);


    $("#save-current-theme").click(() => {
        theme.save(jQuery.parseJSON(localStorage.customTheme));
    });


    // Unlock dev mode after 10 shift clicks
    let numClick = 0;
    $(".logo").click(function() {
        if(numClick == 10){
            numClick = 0;

            if(localStorage.dev == 'true'){
                localStorage.dev = 'false';
                $('body').removeClass('dev');
            } else{
                localStorage.dev = 'true';
                $('body').addClass('dev');
            }
        }

        else{
            if(event.shiftKey == true) numClick++;
            setTimeout(() =>{
                if(numClick !== 0) numClick = 0;
            }, 2000);
        }
    });

    if(localStorage.dev == "true") $('body').addClass('dev');
    $("#reset-storage").click(() => storage.resetAll());
    $("#guid").text(localStorage.guid);
});




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