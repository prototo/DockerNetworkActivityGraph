function CanvasView() {
    this.canvas = require('./Canvas.js');
    this.context = this.canvas.context;

    this.draw = function() {
        throw "Function not implemented";
    }
};

module.exports = CanvasView;
