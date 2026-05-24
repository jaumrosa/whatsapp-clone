import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.bundle.js';

export class DocumentPreviewController {
    constructor(file){
        this._file = file;
    }

    getPreviewData(){
        return new Promise((s, f) => {
            const reader = new FileReader();
            switch(this._file.type){
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/webp':
                case 'image/gif': 
                    reader.onload = e => {
                        s({ src: reader.result, info: this._file.name });
                    }
                    reader.onerror = e => { f(e); }
                    reader.readAsDataURL(this._file);
                    break;
                

                case 'application/pdf': 
                    reader.onload = e => {
                        pdfjsLib.getDocument(new Uint8Array(reader.result)).promise.then(pdf => {
                            pdf.getPage(1).then(page => {
                                const maxHeight = 320;
                                const viewport = page.getViewport({scale: 1});
                                const scale =  maxHeight / viewport.height;
                                const canvas = document.createElement('canvas');
                                const canvasContext = canvas.getContext('2d');

                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                page.render({
                                    canvasContext,
                                    viewport
                                }).promise.then(() => {
                                    let plural = (pdf.numPages) > 1 ? 's' : '';
                                    s({
                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} página${plural}`
                                    });
                                }).catch(err => {
                                    f(err);
                                }) 

                            }).catch(err =>{
                                f(err);
                            })

                        }).catch(err => {
                            f(err);
                        });
                    }
                    
                    reader.readAsArrayBuffer(this._file);
                    break;

                default:
                    f();
            }
        });
    }
}
