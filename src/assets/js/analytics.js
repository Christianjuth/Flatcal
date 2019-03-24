// You must make sure you have the full rights to use this service, to upload data, and to use it with your Google Analytics account.
// You will give your end users proper notice about the implementations and features of Google Analytics you use (e.g. notice about what data you will collect via Google Analytics, and whether this data can be connected to other data you have about the end user). You will either get consent from your end users, or provide them with the opportunity to opt-out from the implementations and features you use.
// You will not upload any data that allows Google to personally identify an individual (such as certain names, social security numbers, email addresses, or any similar data), or data that permanently identifies a particular device (such as a mobile phone’s unique device identifier if such an identifier cannot be reset).
// If you upload any data that allows Google to personally identify an individual, your Google Analytics account can be terminated, and you may lose your Google Analytics data.
// You will only session stitch authenticated and unauthenticated sessions of your end users if your end users have given consent to such stitch, or if such merger is allowed under applicable laws and regulations.



if(localStorage.dev !== 'true'){
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-54875825-1']); //account number
    _gaq.push(['_gat._anonymizeIp']);
    _gaq.push(['userId', localStorage.guid]);
    _gaq.push(['appVersion', appVersion]);
    _gaq.push(['_trackPageview']); //push current page

    (function() {
        var ga = document.createElement('script'); 
        ga.type = 'text/javascript'; 
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(ga, s);
    })();
}

var analyticsEvent = (category, action, opt_label, opt_value, opt_noninteraction) => {
    if(localStorage.dev !== 'true')
        _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
};

var trackButton = (name) => {
    if(localStorage.dev !== 'true')
        analyticsEvent(name, 'clicked');
};