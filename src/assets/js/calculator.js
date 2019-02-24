class Calculator {

    createData(data) {

        let defaults = {
            state: {
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
        this.clearNext = false;

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
            state = this.state = data.state;
        data.radDeg.prepend(`<span></span>`);
        this.historyPosition = 0;
        this.historyFuture = this.value();

        setInterval(() => {
            if(JSON.stringify(this.currentState) !== JSON.stringify(state))
                this.render();
        }, 50);
        this.render();

        return this;
    }


    render() {
        let data = this.data,
            state = this.state = data.state,
            history = $.parseJSON(state.history),
            mode = state.radDeg;

        this.currentState = JSON.parse(JSON.stringify(state));

        let renderScreen = (text) => {
            data.screen
            .text(text)
            .css({'font-size': this.fontSize(text)});

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
        };

        // resume state
        data.radDeg.find('span').text(state.radDeg);

        // validate
        let eqIn = state.screen.replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq1 = new Equation(eqIn),
            eq2 = new Equation(eqIn+' 1'),
            eq3 = new Equation(eqIn+' + 1');

        let valid = eq1.isValid() || eq2.isValid() || eq3.isValid();
        if(valid) renderScreen(state.screen);
        else      renderScreen('0');
    }


    setState(key, value) {
        let state = this.state;
        if(key === 'screen') this.clearNext = false;
        state[key] = value;
        this.state = JSON.parse(JSON.stringify(state));
        this.render();
    }



    historyUp() {
        let state = this.state,
            history = $.parseJSON(state.history);

        if(this.historyPosition == 0)
            this.historyFuture = this.value();

        if(this.historyPosition < history.length)
            this.historyPosition++;
        
        let value = history.slice(this.historyPosition * -1)[0];
        this.setState('screen', value);
        return this;
    }


    historyDown() {
        let state = this.state, value;

        // prevent going sub zero
        if(this.historyPosition > 0)
            this.historyPosition--;

        if(this.historyPosition > 0){
            let history = $.parseJSON(state.history);
            value = history.slice(this.historyPosition * -1)[0];
        } 

        else if(this.historyFuture)
            value = this.historyFuture;

        this.setState('screen', value);
        return this; 
    }

    historyRecord(eq) {
        let state = this.state,
            history = $.parseJSON(state.history);

        if(eq !== history[history.length-1]){
            history.push(eq);
            history = history.slice(-50);
            this.setState('history', JSON.stringify(history));
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

    value(val) {
        let out;
        if(typeof val !== 'undefined'){
            this.clearNext = false;
            this.setState('screen', val);
            out = this;
        }
        else out = this.state.screen;
        return out;
    }


    mode(mode) {
        let state = this.state,
            data = this.data;
        if(['rad', 'deg'].includes(mode))
            this.setState('radDeg', mode);
        return this;
    }

    toggleMode() {
        let mode = this.state.radDeg;
        mode = ['rad', 'deg'].filter(m => m != mode)[0];
        this.mode(mode);
        return this;
    }

    add(char) {
        let data = this.data,
            state = this.state,
            history = $.parseJSON(state.history),
            val = this.value();

        char = char.toString();

        // replace zero if needed
        if(this.clearNext && !/^(-|\+|\*|\/|\.)/.test(char))
            val = char;
        else if(val === '0' && !/^(\+|\*|\/|\.)/.test(char))
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
            this.setState('screen', val);
            data.onAdd(char);
        } 
        
        return valid;
    }


    solve() {
        let data = this.data,
            state = this.state,
            history = $.parseJSON(state.history),
            val = this.value().replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq = new Equation(val),
            before = eq.toString();

        if(before !== eq.solve()){
            this.setState('before', before);
            data.screenBefore.text(before);
            data.screenWrap.addClass('before');
            this.historyRecord(before);
        }

        this.setState('screen', eq.solve(state.radDeg));
        this.clearNext = true;
        return this;
    }


    clear() {
        if(this.clearNext){
            this.allClear();
            return this;
        }

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
            this.setState('screen', val);
        }
        return this;
    }

    allClear() {
        let state = this.state,
            data = this.data;
        
        this.setState('before', '');
        data.screenBefore.text('');
        data.screenWrap.removeClass('before').removeClass('after');

        this.historyPosition = 0;
        this.historyFuture = '0';
        this.setState('screen', '0');
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
        this.historyFuture = value;
        this.setState('screen', value);
        return value;
    }
}


if(typeof module !== 'undefined') 
    module.exports = Calculator;
else if(typeof window == 'object')
    window.Calculator = Calculator;