class WhatsAppController {
    constructor() {
        console.log("Funcionando!");
        this.loadElements();
    }

    loadElements(){
        this.el = {};
        document.querySelectorAll('[id]').forEach(element => {
            this.el[Format.getCamelCase('id')] = element;
        });
    }
}