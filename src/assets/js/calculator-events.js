$(document).ready(function() {
    $('.button[value]').click(function() {
        let value = $(this).attr('value');
        calculator.add(value);
    });

    $('.button[fun]').click(function() {
        let fun = $(this).attr('fun');
        calculator[fun]();
    });
});
