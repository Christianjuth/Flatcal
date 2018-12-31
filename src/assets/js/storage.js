var storage = {
    get : function(name){
        return localStorage[name];
    },

    update : function(name, data){
        return localStorage[name] = data;
    },

    dump : function(){
        var data = new Array();
        for (var i=0; i < localStorage.length; i++) {
            data.push(localStorage.key(i));
        }

        return data;
    },

    reset : function(name){
        localStorage.removeItem(name);
    },

    resetAll : function(){
        var storageItems = this.dump();
        for(i = 0; i < storageItems.length; i++){
            if(storageItems[i] != "guid" && storageItems[i] != "dev") this.reset(storageItems[i]);
            location.reload();
        }
    }
}
