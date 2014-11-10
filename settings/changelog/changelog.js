$(document).ready(function() {
    if(clientInformation.onLine != true){
        $("#content").hide();
        $("#offline").show();
        myLibrary("#offline").center();
        setTimeout(timer,1000);
        setTimeout(function(){location.reload()}, 31000);
    }

    else{
        $.getJSON("https://raw.githubusercontent.com/Christianjuth/calculator-browser-extension/JSON/changelog.json", function(data) {
            for(i = 0; i < data.length; i++){
                line = data[i];
                if(i == 0){
                    changelogLine(line);
                }

                else{
                    changelogLine(line);
                }
            };
        });
    }
});

function changelogLine(options){
    var d = new Date(options.date.replace(/-/,"/"));
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var m = month[d.getMonth()];
    var day = d.getUTCDate();
    var y = d.getFullYear();

    $("<tr><td><a href='" + options.link + "'>" + options.version + "</a></td><td>" + options.description + "</td><td>" + m + "-" + day + "-" + y + "</td></tr>").appendTo("table");
}

var timerNumber = 30;
function timer(){
    $("#offline > h1").text($("#offline > h1").text().replace(timerNumber,timerNumber - 1));
    timerNumber = timerNumber - 1;
    setTimeout(timer,1000);
}
