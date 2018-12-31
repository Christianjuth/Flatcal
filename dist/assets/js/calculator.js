let calculator={ini:function(a){this.storage=a.storage;let t=this.storage;a.max=a.max||15,a.max=Math.min(Math.round($("#input-container").width()/18-1),a.max),void 0!==typeof a.selector&&($.each(a.selector,function(a,t){calculator.selector[a]=$(t)}),$.each(a.options,function(a,t){calculator.options[a]=t}),this.options.maxLength=a.max,"rad"==t.radDeg?this.rad():this.deg(),"0"!=t.m&&$("#m-status").text("m"),""===t.op||""===t.second?this.screen.set(t.first):this.screen.set(t.second))},value:function(){return parseFloat(this.screen.get())},selector:{},options:{},numberClicked:function(a){let t=this.storage;return 1==t.clear&&this.screen.clear(),""==t.op?t.first.replace(/-/g,"").replace(/\./g,"").length<this.options.maxLength&&(t.first+=a,this.screen.set(t.first,!1)):t.second.replace(/(-|\.)/g,"").length<this.options.maxLength&&(t.second+=a,this.screen.set(t.second,!1)),a},screen:{set:function(a){""==(a=String(a))&&(a="0"),-1!=a.indexOf(".")&&"-0"!=a?a=String(parseInt(a.split(".")[0])+"."+a.split(".")[1]):"-0"!=a&&(a=String(parseInt(a)));var t=""!=a&&void 0!=a&&"undefined"!=a;if("NaN"==a||a.split(".")[0].replace(/-/,"").length>calculator.options.maxLength||!t)return calculator.screen.clear(),calculator.selector.screen.text("ERROR"),!1;if(a.replace(/-/,"").length<=calculator.options.maxLength&&t)calculator.selector.screen.text(calculator.parse.commas(a));else if(a.split(".")[0].replace(/-/,"").length<calculator.options.maxLength&&t){let t=calculator.options.maxLength-a.split(".")[0].length,c=calculator.parse.commas(math.round(parseFloat(a),t));calculator.selector.screen.text(c)}return calculator.selector.screen.text().replace(/,/g,"")},get:function(){return calculator.selector.screen.text().replace(/,/g,"")},length:function(){return this.get().replace(/\./g,"").replace(/-/g,"").length},clear:function(){let a=calculator.storage;""!==a.second&&(a.lastSecond=a.second),a.clear=!1,a.first="0",a.second="",calculator.selector.screen.text(""),calculator.animate.op(),a.op="",calculator.screen.set(0)}},operator:function(a=""){let t=this.storage;""!==t.op?(this.calculate(!1,!0),t.clear=!1,t.op=a,this.animate.op(a)):(t.clear=!1,t.op=a,this.animate.op(a))},calculate:function(a,t){let c,e,r,l=this.storage;if(""!==l.op&&(""!==l.second||!t)){switch(["0",""].includes(this.second)||(this.lastSecond=this.second),c=parseFloat(l.first),e=""!==l.second?parseFloat(l.second):parseFloat(l.lastSecond),l.op){case"plus":r=c+e;break;case"subtract":r=c-e;break;case"multiply":r=c*e;break;case"divide":r=c/e;break;case"mod":r=c%e;break;case"pow-of-y":r=Math.pow(c,e);break;case"square-root-y":r=this.math.nthroot(c,e)}calculator.screen.set(r),this.animate.op(),l.first=String(r),l.second="",!0===a&&(this.clear=!0)}},mathFunctions:{pi:()=>String(Math.PI),e:()=>Math.E,pow:(a,t)=>math.pow(a,t),nthroot:(a,t)=>{try{let c=t%2==1&&a<0;c&&(a=-a);let e=Math.pow(a,1/t);if(t=Math.pow(e,t),Math.abs(a-t)<1&&a>0==t>0)return c?-e:e}catch(a){}},in:a=>Math.log(a),log:(a,t)=>math.log(a,t),sin:a=>math.sin(math.unit(a,calculator.storage.radDeg)),cos:a=>math.cos(math.unit(a,calculator.storage.radDeg)),tan:a=>math.tan(math.unit(a,calculator.storage.radDeg)),sinh:a=>math.sinh(math.unit(a,calculator.storage.radDeg)),cosh:a=>math.cosh(math.unit(a,calculator.storage.radDeg)),tanh:a=>math.tanh(math.unit(a,calculator.storage.radDeg)),asin:a=>"rad"==calculator.storage.radDeg?math.asin(a):math.asin(a)*(180/Math.PI),acos:a=>"rad"==calculator.storage.radDeg?math.acos(a):math.acos(a)*(180/Math.PI),atan:a=>"rad"==calculator.storage.radDeg?math.atan(a):math.atan(a)*(180/Math.PI),asinh:function(a){return Math.asinh(a)},acosh:function(a){return Math.acosh(a)},atanh:function(a){return Math.atanh(a)}},math:function(a,t,c){let e=calculator.mathFunctions[a](parseFloat(t),parseFloat(c));if(!1!==e)return""==calculator.op?calculator.first=calculator.screen.set(e):calculator.second=calculator.screen.set(e);calculator.screen.get()},event:{addDecimal:function(){1==calculator.clear&&calculator.screen.clear(),-1==calculator.screen.get().indexOf(".")&&(""==calculator.op?(calculator.first=calculator.first+".",calculator.screen.set(calculator.first)):("."!=calculator.second&&""!=calculator.second||(calculator.second="0."),calculator.second=calculator.second+".",calculator.screen.set(calculator.second)))},posNeg:function(){""==calculator.op&&(0==calculator.first.length?calculator.first="-0":-1==calculator.first.indexOf("-")?calculator.first="-"+calculator.first:calculator.first=calculator.first.replace(/-/g,""),calculator.screen.set(calculator.first)),""!=calculator.op&&(0==calculator.second.length?calculator.second="-0":-1==calculator.second.indexOf("-")?calculator.second="-"+calculator.second:calculator.second=calculator.second.replace(/-/g,""),calculator.screen.set(calculator.second))},radDeg:function(){"rad"==calculator.selector.radDeg.text()?calculator.storage.radDeg=calculator.deg():"deg"==calculator.selector.radDeg.text()&&(calculator.storage.radDeg=calculator.rad())},percentage:function(){return""==calculator.op?(calculator.first=String(.01*calculator.first*1),calculator.clear=!0,calculator.screen.set(calculator.first)):(calculator.second=String(calculator.first*(.01*calculator.second)),calculator.clear=!0,calculator.screen.set(calculator.second))},sq:()=>""==calculator.op?(calculator.first=String(calculator.first*calculator.first),calculator.clear=!0,calculator.screen.set(calculator.first)):(calculator.second=String(calculator.second*calculator.second),calculator.clear=!0,calculator.screen.set(calculator.second))},m:{recall:()=>{""==calculator.op?calculator.first=calculator.storage.m:calculator.second=calculator.storage.m,calculator.screen.set(calculator.storage.m)},clear:()=>{calculator.storage.m=0,$("#m-status").text("")},minus:function(){calculator.storage.m-=calculator.value(),"0"!=calculator.storage.m&&$("#m-status").text("m")},plus:function(){calculator.storage.m=parseFloat(calculator.storage.m)+calculator.value(),"0"!=calculator.storage.m&&$("#m-status").text("m")}},parse:{commas:function(a){let t=a.toString().split(".");return t[0]=t[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),t.join(".")}},animate:{op:a=>{let t=$("#"+a);$(".opp").css({"-webkit-transform":"scale(1)"}),void 0!=calculator.storage.op?(t.css({"-webkit-transform":"scale(0.90)"}),setTimeout(()=>{t.css({"-webkit-transform":"scale(0.95)"})},100)):t.css({"-webkit-transform":"scale(1)"})}},clipboard:{copy:a=>{let t=$("<input/>");t.val(a),$("body").append(t),t.select(),document.execCommand("copy"),t.remove()},paste:function(){let a=$("<input/>");$("body").append(a),a.select(),document.execCommand("paste");let t=parseFloat(a.val());isNaN(parseFloat(t))?(calculator.selector.screen.text("ERROR"),calculator.screen.clear()):(calculator.screen.set(t),""==calculator.op?calculator.first=t:calculator.second=t),a.remove()}},rad:function(){return this.selector.radDeg.text("rad"),"rad"},deg:function(){return this.selector.radDeg.text("deg"),"deg"}};
//# sourceMappingURL=calculator.js.map