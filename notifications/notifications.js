$(document).ready(function() {
    checkForNotifications();
});

function checkForNotifications(){
<<<<<<< Updated upstream
    $.getJSON("https://raw.githubusercontent.com/Christianjuth/calculator-browser-extension/JSON/notifications.json", function(data) {
=======
    $.getJSON(chrome.extension.getURL('/notifications/notifications.json'), function(data) {
>>>>>>> Stashed changes
        data.sort(compare);

        for(i = 0; i < data.length; i++){
            var notification = data[i];
            var json = $.parseJSON(localStorage.notify);
            var delayDone = parseInt(moment(json.date, "YYYYMMDD").add("days", json.delay).format("YYYYMMDD")) <= parseInt(moment().format("YYYYMMDD"));
            var isNextId = notification.id == (parseInt($.parseJSON(localStorage.notify).id) + 1);

            if(notification.id > $.parseJSON(localStorage.notify).id){
                if(localStorage.noNotifyDelay == "true" && localStorage.limitNotifications == "false" && isNextId){
                    createNotification(notification.title, notification.message);
                    json.id = notification.id;
                    json.date = moment().format("YYYYMMDD");
                    json.delay = Math.floor((Math.random() * 4) + 3);
                    localStorage.notify = JSON.stringify(json);
                    break;
                }

                else if(delayDone && localStorage.limitNotifications == "false"){
                    createNotification(notification.title, notification.message);
                    json.id = notification.id;
                    json.date = moment().format("YYYYMMDD");
                    json.delay = Math.floor((Math.random() * 4) + 3);
                    localStorage.notify = JSON.stringify(json);
                    break;
                }

                else if(localStorage.limitNotifications == "true" && notification.important == true && delayDone){
                    createNotification(notification.title, notification.message);
                    json.id = notification.id;
                    json.date = moment().format("YYYYMMDD");
                    json.delay = Math.floor((Math.random() * 4) + 3);
                    localStorage.notify = JSON.stringify(json);
                    break;
                }
            }
        }

        setTimeout(function() {
            checkForNotifications();
        }, 300000);
    });
}

function createNotification(title, message){
    var opt = {
        type: "basic",
        title: title,
        message: message,
        iconUrl: "../resources/icons/icon.png"
    };
    chrome.notifications.create("", opt, function(id) {});
}

function compare(a,b) {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
}
