// You must make sure you have the full rights to use this service, to upload data, and to use it with your Google Analytics account.
// You will give your end users proper notice about the implementations and features of Google Analytics you use (e.g. notice about what data you will collect via Google Analytics, and whether this data can be connected to other data you have about the end user). You will either get consent from your end users, or provide them with the opportunity to opt-out from the implementations and features you use.
// You will not upload any data that allows Google to personally identify an individual (such as certain names, social security numbers, email addresses, or any similar data), or data that permanently identifies a particular device (such as a mobile phone’s unique device identifier if such an identifier cannot be reset).
// If you upload any data that allows Google to personally identify an individual, your Google Analytics account can be terminated, and you may lose your Google Analytics data.
// You will only session stitch authenticated and unauthenticated sessions of your end users if your end users have given consent to such stitch, or if such merger is allowed under applicable laws and regulations.

if(localStorage.dev !== 'true'){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

    ga('create', 'UA-54875825-1', 'auto');
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
    ga('set', 'userId', localStorage.guid);
    ga('set', 'anonymizeIp', true);
    ga('send', 'pageview', location.pathname, {
        'dimension1': appVersion
    });
}

var analyticsEvent = (category, action, opt_label, opt_value, opt_noninteraction) => {
    if(localStorage.dev !== 'true'){
        ga('send', 'event', {
            'dimension1': appVersion,
            'eventCategory': category,
            'eventAction': action
        });
    }
};

var trackButton = (name, event = 'click') => {
    if(localStorage.dev !== 'true')
        analyticsEvent(name, event);
};