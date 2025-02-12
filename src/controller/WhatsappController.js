class WhatsappController {

    constructor() {

        console.log('WhatsAppController OK');

        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
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

        HTMLFormElement.prototype.getForm = function() {

            return new FormData(this);

        }

        HTMLFormElement.prototype.toJSON = function() {

            const json = {};

            this.getForm().forEach((value, key) => {

                json[key] = value;

            });

            return json

        }

    }

    initEvents() {

        this.el.myPhoto.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();

            setTimeout(() => {
                this.el.panelEditProfile.addClass('open');
                
            }, 300);
            

        });

        this.el.btnNewContact.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();

            setTimeout(() => {
                this.el.panelAddContact.addClass('open');

            }, 300);
            
        });

        this.el.btnClosePanelEditProfile.on('click', e => {

            this.el.panelEditProfile.removeClass('open');
        });

        this.el.btnClosePanelAddContact.on('click', e => {

            this.el.panelAddContact.removeClass('open');
        });

        this.el.photoContainerEditProfile.on('click', e => {
            
            this.el.inputProfilePhoto.click();

        });

        this.el.inputNamePanelEditProfile.on('keypress', e => {

            if (e.key === 'Enter') {

                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }

        });

        this.el.btnSavePanelEditProfile.on('click', e => {

            console.log(this.el.inputNamePanelEditProfile.innerHTML);

        });

        this.el.formPanelAddContact.on('submit', e => {

            e.preventDefault();

            const formData = new FormData(this.el.formPanelAddContact);


        });
        //this.el.contactsMessagesList.querySelectorAll('.contact-item).forEach(item => {})
        for (const item of this.el.contactsMessagesList.querySelectorAll('.contact-item')){

            item.on('click', e =>{

                this.el.home.hide();
                this.el.main.css({
                    display:'flex'
                });
            });
        };

        this.el.btnAttach.on('click', e => {

            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));
        });

        this.el.btnAttachPhoto.on('click', e => {

            console.log('photo');
        });

        this.el.btnAttachCamera.on('click', e => {

            console.log('camera');
        });

        this.el.btnAttachDocument.on('click', e => {

            console.log('document');
        });

        this.el.btnAttachContact.on('click', e => {

            console.log('contact');
        });


    }

    closeMenuAttach(e) {   
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }

    closeAllLeftPanel() {
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();
    }

}