class Calculator {

    createData(data) {

        let defaults = {
            storage: {tutorial: 0,
                type: 'scientific',
                radDeg: 'deg',
                m: '0',
                screen: '0',
                before: '',
                history: '[]'
            },
            onAdd: () => {}
        };

        data = $.extend({}, defaults, data);

        ['screenWrap','radDeg',
        'screen','screenBefore',
        'screenAfter'].forEach(key => {
            if(data[key]) data[key] = $(data[key]);
            else data[key] = $('<div>');
        });

        return this.data = data;
    }

    constructor(config) {
        let data = this.createData(config),
            storage = this.storage = data.storage;

        // resume state
        data.radDeg.prepend(`<span>${storage.radDeg}</span>`);

        let eq = new Equation(storage.screen);
        if(eq.isValid()) this.value(storage.screen);
        else             this.value('0');

        this.historyPosition = 0;
        this.historyFuture = this.value();

        return this;
    }



    historyUp(down = 1) {
        let storage = this.storage,
            history = $.parseJSON(storage.history);

        if(this.historyPosition == 0)
            this.historyFuture = this.value();

        if(this.historyPosition < history.length)
            this.historyPosition + down;
        
        let value = history.slice(this.historyPosition * -1)[0];
        this.value(value);
        return this;
    }


    historyDown(up = 1) {
        let storage = this.storage,
            value;

        // prevent going sub zero
        if(this.historyPosition > 0)
            this.historyPosition - up;

        if(this.historyPosition > 0){
            let history = $.parseJSON(storage.history);
            value = history.slice(this.historyPosition * -1)[0];
        } 

        else if(this.historyFuture){
            value = this.historyFuture;
        }

        this.value(value); 
        return this; 
    }

    historyRecord(eq) {
        let storage = this.storage,
            history = $.parseJSON(storage.history);

        if(eq !== history[history.length-1]){
            history.push(eq);
            history = history.slice(-50);
            storage.history = JSON.stringify(history);
        }
        return this;
    }



    fontSize(text){
        let data = this.data,
            scaleOutput = 600,
            output;

        // calculate text width
        let $input = $(`<p class="simulate-input">${text}</p>`),
            textWidth = $input.appendTo($('.input-wrap')).width();
        $input.remove();

        let screenWidth = $(data.screen).width(),
            space = screenWidth - textWidth;

        if(space <= 50)
            output = (space + scaleOutput)/(50 + scaleOutput) + 'em';
        else
            output = '';
        return output;
    }


    value(text) {
        let storage = this.storage,
            history = $.parseJSON(storage.history),
            mode = storage.radDeg,
            data = this.data;

        // setter
        if(typeof text !== 'undefined'){
            storage.screen = text;
            data.screen
            .text(text)
            .css({'font-size': this.fontSize(text)});
        } 

        // getter
        else
            return data.screen.text();

        let eq = new Equation(text.replace(/Ans/g, `(${history.slice(-1)[0]})`)),
            solution = eq.isValid() ? eq.solve(mode) : false;

        if(solution && solution !== eq.toString()){
            data.screenWrap.removeClass('before');

            if(!isNaN(solution)){
                data.screenWrap.addClass('after');
                data.screenAfter.text(solution);
            }
        }

        else
            data.screenWrap.removeClass('after');
    }



    mode(mode) {
        let storage = this.storage,
            data = this.data;

        if(['rad', 'deg'].includes(mode)){
            storage.radDeg = mode;
            data.radDeg.find('span').text(mode);

            // force screen refresh
            this.value(this.value());
        }

        return this;
    }

    toggleMode() {
        let mode = this.storage.radDeg;
        mode = ['rad', 'deg'].filter(m => m != mode)[0];
        this.mode(mode);
        return this;
    }

    add(char) {
        let data = this.data,
            storage = this.storage,
            history = $.parseJSON(storage.history),
            val = this.value();

        char = char.toString();

        // replace zero if needed
        if(val === '0' && !/^(\+|\*|\/)/.test(char))
            val = char;
        else
            val += char;

        // validate
        let eqIn = val.replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq1 = new Equation(eqIn),
            eq2 = new Equation(eqIn+' 1'),
            eq3 = new Equation(eqIn+' + 1');

        let valid = eq1.isValid() || eq2.isValid() || eq3.isValid();
        if(valid){
            this.value(val);
            data.onAdd(char);
        } 
        
        return valid;
    }


    calculate() {
        let data = this.data,
            storage = this.storage,
            history = $.parseJSON(storage.history),
            val = this.value().replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq = new Equation(val),
            before = eq.toString();

        if(before !== eq.solve()){
            storage.before = before;
            data.screenBefore.text(before);
            data.screenWrap.addClass('before');

            this.historyRecord(before);
        }

        this.value(eq.solve(storage.radDeg));
        return this;
    }


    clear() {
        this.historyPosition = 0;
        let val = this.value();

        if(/((s|i|n|c|o|t|a|l|r|g){2,4}[0-9]*)(\(|)$/i.test(val))
            val = val.replace(/((s|i|n|c|o|t|a|l|r|g){2,4}[0-9]*)(\(|)$/i, '');
        else
            val = val.substr(0,val.length-1);
        

        if(val.length == 0){
            this.allClear();
        }
        else{
            this.historyFuture = val;
            this.value(val);
        }
        return this;
    }

    allClear() {
        let storage = this.storage,
            data = this.data;
        
        storage.before = '';
        data.screenBefore.text('');
        data.screenWrap.removeClass('before').removeClass('after');

        this.historyPosition = 0;
        this.historyFuture = '0';
        this.value('0');
        return this;
    }


    copy() {
        let $input = $('<input/>'),
            eq = new Equation(this.value());
        eq = eq.toString();

        $input.val(eq);
        $('body').append($input);
        $input.select();
        document.execCommand('copy');
        $input.remove();
        return eq;
    }


    paste() {
        let $input = $('<input/>');
        $('body').append($input);
        $input.select();
        document.execCommand('paste');
        let value = $input.val();

        if(!this.add(value)){
            try{
                value = value.match(/[0-9]+(\.[0-9]+|)/)[0];
                this.add(value);
            } catch(e){}; 
        }
        
        $input.remove();
        return value;
    }
}


if(typeof module !== 'undefined') 
    module.exports = Calculator;
else if(typeof window == 'object')
    window.Calculator = Calculator;