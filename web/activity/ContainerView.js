var CanvasView = require('./CanvasView.js');
var Colour = require('./Colour.js');

function ContainerView(options, container) {
    // set the container for this view to render
    if (typeof(container) !== 'object') { throw "Container not specified for view"; }
    this.container = container;

    // extend the CanvasView
    this.prototype = Object.create(CanvasView.prototype)
    CanvasView.apply(this, arguments);

    // make sure the options are a thing
    options = typeof(options) === 'object' ? options : {};

    // set options on this
    this.background = new Colour();
    this.radius = options.radius || 10;
    this.stroke_colour = options.stroke_colour || 'black';
    this.stroke_weight = options.stroke_weight || 1;

    this.font = "12px sans-serif";
    this.textAlign = "center";

    this.drawNode = function(vector) {
        var circle = new Path2D();
        circle.arc(vector.x, vector.y, this.radius, 0, 2 * Math.PI);

        // draw that circle, so good
        this.context.fillStyle = this.background.toString();
        this.context.fill(circle);

        // stroke the circle, oh yeah
        this.context.strokeStyle = this.stroke_colour;
        this.context.lineWidth = this.stroke_weight;
        this.context.stroke(circle);
    }

    this.drawLabel = function(vector) {
        this.context.font = this.font;
        this.context.textAlign = this.textAlign;

        // stroke the text
        this.context.strokeStyle = 'white';
        this.context.strokeText(
            this.container.name,
            vector.x,
            vector.y + 30
        );

        // fill it up
        this.context.fillStyle = 'black';
        this.context.fillText(
            this.container.name,
            vector.x,
            vector.y + 30
        );
    }

    this.draw = function(vector) {
        this.drawNode(vector);
        this.drawLabel(vector);
    };
};

module.exports = ContainerView;
