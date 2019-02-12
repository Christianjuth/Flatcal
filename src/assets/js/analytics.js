if(localStorage.dev !== 'true'){
    let _gaq = [];
    _gaq.push(['_setAccount', 'UA-54875825-1']); //account number
    _gaq.push(['_trackPageview']); //push current page

    (function() {
        let ga = document.createElement('script'); 
        ga.type = 'text/javascript'; 
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        let s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
}

let analyticsEvent = (category, action, opt_label, opt_value, opt_noninteraction) => {
    if(localStorage.dev !== 'true')
        _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
};

let trackButton = (name) => {
    if(localStorage.dev !== 'true')
        analyticsEvent(name, 'clicked');
};