/*==========================================================
❘❘                                                          ❘❘
❘❘ • ©2014 Christian Juth                                   ❘❘
❘❘ • javascript library v1.0.1                                ❘❘
❘❘ • Creator Christian Juth                                 ❘❘
❘❘                                                          ❘❘
❘❘ • Feel free to redistibute but modifyed copys are for    ❘❘
❘❘   your own use only unless aproved by me                 ❘❘
❘❘                                                          ❘❘
==========================================================*/

var myLibrary = function (selector) {
    return new DOM(selector);
};

var DOM = function (selector) {

    //  selector------------------------->
    element = new Array;
    if(selector == undefined){
        selector = "";
    }

    if(selector.indexOf(".") != -1){
        selector = selector.replace(/./,"");
        element = document.getElementsByClassName(selector);
    }

    else if(selector.indexOf("#") != -1){
        selector = selector.replace(/#/,"");
        element[0] = document.getElementById(selector);
    }

    else{
        element = document.getElementsByTagName(selector);
    }

    //  functions----------------------->
    this.center = function() {
        for(i = 0; i < element.length; i ++){
            element[i].style.display = "inline-table";
            element[i].style.position = "inherit";
            element[i].style.top = 0;
            element[i].style.bottom = 0;
            element[i].style.right = 0;
            element[i].style.left = 0;
            element[i].style.marginLeft = 0;
            element[i].style.marginTop = 0;

            var height = element[i].offsetHeight;
            var width = element[i].offsetWidth;

            element[i].style.position = "absolute";
            element[i].style.top = "50%";
            element[i].style.bottom = "50%";
            element[i].style.right = "50%";
            element[i].style.left = "50%";
            element[i].style.marginTop = String(height / -2) + "px";
            element[i].style.marginLeft = String(width / -2) + "px";
        }

        return new DOM(selector);
    }

    this.longShadow = function(type, size, color, direction, callback) {
        var shadow = "";

        if(direction == "SE" || direction == "se" || direction == "Se" || direction == "Se" || direction == undefined){
            for(i = 0; i <= size; i++){

                shadow = shadow + color + " " + i + "px " + (parseFloat(i) + 1) + "px " + "0px, ";
                shadow = shadow + color + " " + (parseFloat(i) + 1) + "px " + i + "px " + "0px, ";

                if(i == size){
                    shadow = shadow + color + " " + (parseFloat(i) + 2) + "px " + (parseFloat(i) + 1) + "px " + "0px, " + color + " " + (parseFloat(i) + 2) + "px " + (parseFloat(i) + 2) + "px " + "0px";
                }
            }
        }

        else if(direction == "SW" || direction == "sw" || direction == "Sw" || direction == "Sw"){
            for(i = 0; i <= size; i++){

                shadow = shadow + color + " -" + i + "px " + (parseFloat(i) + 1) + "px " + "0px, ";
                shadow = shadow + color + " -" + (parseFloat(i) + 1) + "px " + i + "px " + "0px, ";

                if(i == size){
                    shadow = shadow + color + " -" + (parseFloat(i) + 2) + "px " + (parseFloat(i) + 1) + "px " + "0px, " + color + " -" + (parseFloat(i) + 2) + "px " + (parseFloat(i) + 2) + "px " + "0px";
                }
            }
        }

        else if(direction == "NE" || direction == "ne" || direction == "Ne" || direction == "nE"){
            for(i = 0; i <= size; i++){

                shadow = shadow + color + " " + i + "px -" + (parseFloat(i) + 1) + "px " + "0px, ";
                shadow = shadow + color + " " + (parseFloat(i) + 1) + "px -" + i + "px " + "0px, ";

                if(i == size){
                    shadow = shadow + color + " " + (parseFloat(i) + 2) + "px -" + (parseFloat(i) + 1) + "px " + "0px, " + color + " " + (parseFloat(i) + 2) + "px -" + (parseFloat(i) + 2) + "px " + "0px";
                }
            }
        }

        else if(direction == "NW" || direction == "nw" || direction == "Nw" || direction == "nE"){
            for(i = 0; i <= size; i++){

                shadow = shadow + color + " -" + i + "px -" + (parseFloat(i) + 1) + "px " + "0px, ";
                shadow = shadow + color + " -" + (parseFloat(i) + 1) + "px -" + i + "px " + "0px, ";

                if(i == size){
                    shadow = shadow + color + " -" + (parseFloat(i) + 2) + "px -" + (parseFloat(i) + 1) + "px " + "0px, " + color + " -" + (parseFloat(i) + 2) + "px -" + (parseFloat(i) + 2) + "px " + "0px";
                }
            }
        }

        for(i = 0; i < element.length; i ++){
            if(type == "text"){
                element[i].style.textShadow = shadow;
            }

            else{
                element[i].style.boxShadow = shadow;
            }
        }

        if(callback != undefined){
            callback();
        }
        return new DOM(selector);
    }

    this.alertMe = function() {
        alert(element);

        return new DOM(selector);
    }
};
