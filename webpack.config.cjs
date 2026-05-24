const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.mjs'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'dist')
    },
    devServer: {
        static: {
            directory: __dirname
        }
    }
};
