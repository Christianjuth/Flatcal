$(document).ready(() => {
	if(navigator.appVersion.indexOf("Mac") !== -1)
        $('.mac').show();
    else
        $('.windows').show();
    
	theme.load(localStorage.theme);
});