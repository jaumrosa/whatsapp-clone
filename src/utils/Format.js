class Format{

    static getCamelCase(text){

        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }

    static toTime(duration){
        const seconds = parseInt((duration / 1000) % 60);
        const minutes = parseInt((duration / (1000 * 60 * 60)) % 24);
        const hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hours > 0){
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`; 
        }
    }

}