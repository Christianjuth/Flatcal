$(document).ready(function() {
    $('.button[value]').click(function() {
        let value = $(this).attr('value');
        calculator.screen.add(value);
    });

    $('.button[fun]').click(function() {
        let fun = $(this).attr('fun');
        calculator.functions[fun]();
    });
});
