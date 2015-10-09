var CanvasView = require('./CanvasView.js');
var Colour = require('./Colour.js');

function EdgeView() {
    // extend the CanvasView
    this.prototype = Object.create(CanvasView.prototype)
    CanvasView.apply(this, arguments);

    this.background = new Colour(0, 0, 0, 1);

    this.draw = function(vector1, vector2) {
        this.context.strokeStyle = this.background.toString();
        this.context.lineWidth = 1;

        this.context.beginPath();
        this.context.moveTo(vector1.x, vector1.y);
        this.context.lineTo(vector2.x, vector2.y);
        this.context.stroke();
    }

    this.flash = function() {
        this.background.fadeThrough(
            new Colour(0, 255, 0),
            new Colour(0, 0, 0)
        );
    }
}

module.exports = EdgeView;
