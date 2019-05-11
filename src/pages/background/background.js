$(document).ready(() => {
	Headway.init(HW_config);
	setInterval(() => {
	    Headway.init(HW_config);
	}, 300000);
});