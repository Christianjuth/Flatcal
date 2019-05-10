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
            onAdd: () => {},
            onStateUpdate: () => {}
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
        
        $(document).ready(() => {
            this.render();
            data.screenWrap.click((e) => {
                // if target is not link
                if(! $(e.target).is('a') ){
                    this.copy();
                }
            });
        });

        return this;
    }


    render() {
        let data = this.data,
            state = this.state = data.state,
            history = $.parseJSON(state.history),
            mode = state.radDeg;

        this.currentState = JSON.parse(JSON.stringify(state));

        let renderScreen = (text) => {
            data.screen.text(text);

            let eq = new Equation(text.replace(/Ans/g, `(${history.slice(-1)[0]})`)),
                valid = eq.isValid(mode),
                solution = valid[0] ? eq.solve(mode) : false;

            if(!valid[0] && valid[1].indexOf('divide by zero') !== -1){
                data.screenWrap.removeClass('before').addClass('after');
                data.screenAfter.text('ERROR'); 
            }

            else if(!valid[0] && valid[1] == 'imaginary'){
                data.screenWrap.removeClass('before').addClass('after');
                data.screenAfter.text('POSSIBLE DOMAIN ERROR'); 
            }

            else if(valid[0] && solution !== eq.toString()){
                if(!isNaN(solution)){
                    data.screenWrap.removeClass('before').addClass('after');
                    data.screenAfter.text(solution);
                }
            }

            else{
                data.screenWrap.removeClass('after');
            }

            data.screen.css({'font-size': this.fontSize(text)});
        };

        // resume state
        data.radDeg.find('span').text(state.radDeg);
        renderScreen(state.screen);
    }


    setState(key, value) {
        let state = this.state;
        if(key === 'screen') this.clearNext = false;
        state[key] = value;
        this.state = JSON.parse(JSON.stringify(state));
        this.render();
        this.data.onStateUpdate(this.state);
    }



    historyUp() {
        let state = this.state,
            history = $.parseJSON(state.history);

        if(this.historyPosition == 0)
            this.historyFuture = this.value();

        if(this.historyPosition < history.length){
            this.historyPosition++;
            let value = history.slice(this.historyPosition * -1)[0];
            this.setState('screen', value);
        }
    
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
            output;

        // calculate text width
        let $input = $(`<p class="simulate-input">${text}</p>`),
            textWidth = $input.appendTo($('.input-wrap')).width();
        $input.remove();

        let screenWidth = $(data.screen).width();
    
        if(textWidth - screenWidth > 0){
            // increasing pow makes 
            // text decrease faster
            let pow = 1.14,
                scale = Math.pow(screenWidth, pow)/Math.pow(textWidth, pow);
            output = scale+'em';
        }
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

    add(char, event) {
        let data = this.data,
            state = this.state,
            history = $.parseJSON(state.history),
            val = this.value(),
            valid = false;

        char = char.toString();

        // replace zero if needed
        let reg1 = new RegExp('^(-|\\+|\\*|\u00D7|\\/|\u00F7|\\.|\\^|rt)');
        let reg2 = new RegExp('^(\\+|\\*|\u00D7|\\/|\u00F7|\\.|\\^|rt)');
        if(this.clearNext && !reg1.test(char)){
            data.screenWrap.removeClass('before');
            val = char;
        }
        else if(val === '0' && !reg2.test(char))
            val = char;
        else
            val += char;

        // prevent overflow
        if(val.length > 50)
            return false;

        // validate
        let eqIn = val.replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq1 = new Equation(eqIn),
            eq2 = new Equation(eqIn+' 1'),
            eq3 = new Equation(eqIn+' + 1');
            
        [   eq1.isValid(), 
            eq2.isValid(), 
            eq3.isValid()
        ].forEach(v => {
            if(!valid && (v[0] || (v[1] !== 'bad input' && !/Undefined symbol/.test(v[1])))){
                valid = true;
                data.onAdd(char, event);
                this.setState('screen', val);
            }
        });
        
        return valid;
    }


    solve() {
        let data = this.data,
            state = this.state,
            history = $.parseJSON(state.history),
            val = this.value().replace(/Ans/g, `(${history.slice(-1)[0]})`),
            eq = new Equation(val),
            before = eq.toString();

        try{
            let solution = eq.solve(state.radDeg);
            this.setState('screen', solution);
            if(before !== solution){
                this.setState('before', before);
                data.screenBefore.text(before);
                data.screenWrap.removeClass('after').addClass('before');
                this.historyRecord(before);
            }
            this.clearNext = true;
        } catch(e) {
            data.screenWrap.removeClass('before').addClass('after');
            data.screenAfter.text('ERROR');
        };
        
        return this;
    }


    clear() {
        if(this.clearNext){
            this.allClear();
            return this;
        }

        this.historyPosition = 0;
        let val = this.value();

        let fn = [
            'sin',
            'cos',
            'tan',
            'asin',
            'acos',
            'atan',
            'abs',
            'ln',
            'log',
            '\u221A' // sqrt
        ];

        let phrases = [
            'Ans',
            'rt'
        ];

        let reg = new RegExp(`((${fn.join('|')}[0-9]*)(\\(|)|${phrases.join('|')})$`, 'i');

        if(reg.test(val))
            val = val.replace(reg, '');
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

        this.historyPosition = 0;
        this.historyFuture = '0';
        this.setState('screen', '0');

        this.setState('before', '');
        data.screenBefore.text('');
        data.screenWrap.removeClass('before').removeClass('after');

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
        return value;
    }
}


if(typeof module !== 'undefined') 
    module.exports = Calculator;
else if(typeof window == 'object')
    window.Calculator = Calculator;