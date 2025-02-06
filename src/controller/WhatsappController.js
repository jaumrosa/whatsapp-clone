class WhatsappController {

    constructor() {

        console.log('WhatsAppController OK');

        this.elementsPrototype();
        this.loadElements();
    }

    loadElements() {

        this.el = {};

        for (const element of document.querySelectorAll('[id]')) {

            this.el[Format.getCamelCase(element.id)] = element;

        }
    }

    elementsPrototype() {
        
        Element.prototype.hide = function() {

            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function() {

            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function() {

            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }

        Element.prototype.on = function(events, fn) {

            for (const event of events.split(' ')) {
                this.addEventListener(event, fn);
            }
            return this;
        }

        Element.prototype.css = function(styles) {

            for (const name in styles) {
                this.style[name] = styles[name];
            }
            return this;
        }

        Element.prototype.addClass = function(name) {
            this.classList.add(name);
            return this;
        }

        Element.prototype.removeClass = function(name) {
            this.classList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function(name) {
            this.classList.toggle(name);
            return this;
        }

        Element.prototype.hasClass = function(name) {
            return this.classList.contains(name);
        }

    }

}