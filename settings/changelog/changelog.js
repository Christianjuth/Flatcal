$(document).ready(function() {
    $.getJSON(chrome.extension.getURL('settings/changelog/changelog.json'), function(data) {
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
});

function changelogLine(options){
    var d = new Date(options.date.replace(/-/,"/"));
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var m = month[d.getMonth()];
    var day = d.getUTCDate();
    var y = d.getFullYear();

    $("<tr><td><a href='" + options.link + "'>" + options.version + "</a></td><td>" + options.description + "</td><td>" + m + "-" + day + "-" + y + "</td></tr>").appendTo("table");
}
