$(document).ready(function(){$("#ce").mousedown(function(){calculator.screen.clear()}),$("#rad-deg").mousedown(function(){calculator.event.radDeg()}),$(".math").mousedown(function(){var t="",c="";t=void 0!=$(this).attr("x")?$(this).attr("x"):calculator.screen.get(),void 0!=$(this).attr("y")&&(c=$(this).attr("y")),calculator.math($(this).attr("fun"),t,c)}),$(".m").mousedown(function(){calculator.m[$(this).attr("fun")]()}),$(".number").mousedown(function(){$(this).attr("value")>=0&&$(this).attr("value")<=9&&calculator.numberClicked($(this).attr("value"))}),$(".opp").mousedown(function(){calculator.operator($(this).attr("value"))}),$(".event").mousedown(function(){console.log($(this).attr("fun")),console.log(calculator.event),calculator.event[$(this).attr("fun")]()}),$("#point").mousedown(function(){calculator.screen.length()<calculator.maxLength&&calculator.event.addDecimal()}),$("#positive-negative").mousedown(function(){calculator.event.posNeg()}),$("#equal").mousedown(function(){calculator.calculate(!0)}),calculator.section=1,$(".2x").click(function(){1==calculator.section?($("#scientific-1").hide(),$("#scientific-2").show(),calculator.section=2):($("#scientific-2").hide(),$("#scientific-1").show(),calculator.section=1)})});
//# sourceMappingURL=calculator-events.js.map