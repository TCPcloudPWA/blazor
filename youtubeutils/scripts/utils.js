const getElmById = document.getElementById.bind(document);
const getElmsByTagName = document.getElementsByTagName.bind(document);


function scrollToTop() {
    CSupport.scrollToTop();
}


function scrollToId(id) {
    CSupport.scrollToId(id);
}


const CSupport = {
    isEmpty: function (val) {
        if (typeof (val) == "object" && val != null) return false;

        if (typeof (val) == "object" && val == undefined) return true;

        if (val == "" || val == undefined || val == null) return true;

        return false;
    },

    /**
    * @param  {DOMElement} oElm
    * @param  {String} displayStyle - (optional) flex, inline
    */
    showElm: function (oElm, displayStyle) {
        oElm.style.display = displayStyle ? displayStyle : "block";
    },


    hideElm: function (oElm) {
        oElm.style.display = "none";
    },


    scrollToTop: function () {
        window.scrollTo(0, 0);
    },

    scrollToId: function (id) {
        const element = getElmById(id);

        if (element instanceof HTMLElement) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",     // one of start, center, end, or nearest. Defaults to start
                inline: "nearest"   // one of start, center, end, or nearest. Defaults to nearest
            });
        }
    }
};


/*
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHi() {
        return `👋 ${this.name}!`;
    }
}*/
