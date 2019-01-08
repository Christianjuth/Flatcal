$(document).ready(() => {
	if(navigator.appVersion.indexOf("Mac"))
        $('.mac').show();
    else
        $('.windows').show();
    
	theme.load(localStorage.theme);
});