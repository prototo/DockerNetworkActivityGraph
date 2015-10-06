var canvas = document.getElementById('map');
var context = canvas.getContext('2d');
var views = {};

var CanvasView = function(options) {
    options = typeof(options) === 'object' ? options : {};

    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 10;
    this.height = options.height || 10;

    this.draw = function() {
        throw "Function not implemented";
    }
};

var ContainerView = function(options, container) {
    // set the container for this view to render
    if (typeof(container) !== 'object') { throw "Container not specified for view"; }
    this.container = container;

    // extend the CanvasView
    this.prototype = Object.create(CanvasView.prototype)
    CanvasView.apply(this, arguments);

    // make sure the options are a thing
    options = typeof(options) === 'object' ? options : {};

    // set options on this
    this.background = options.background || 'white';
    this.stroke_colour = options.stroke_colour || 'black';
    this.stroke_weight = options.stroke_weight || 2;

    this.font = "12px sans-serif";
    this.textAlign = "center";

    // draw function for ContainerView. Draws a circle. Radical.
    this.draw = function() {
        var circle = new Path2D();
        circle.arc(this.x, this.y, this.width, 0, 2 * Math.PI);

        // draw that circle, so good
        context.fillStyle = this.background;
        context.fill(circle);
        context.strokeStyle = this.stroke_colour;
        context.lineWidth = this.stroke_weight;
        context.stroke(circle);

        // render the container name
        context.fillStyle = 'black';
        context.textAlign = this.textAlign;
        context.fillText(
            this.container.name,
            this.x,
            this.y + 20
        );
    }.bind(this);
};

function setupViews(containers) {
    var x = 50, y = 50, ya = 10;

    containers.forEach(function(container) {
        views[container.name] = new ContainerView(
            { x: x, y: y },
            container
        );

        x += 100;
        if (x > 500) {
            x = 50;
            y += 50;
            ya = 10;
        }
        y += ya;
        ya *= -1;
    });

    return views;
}

(function step() {
    setInterval(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        Object.keys(views).forEach(function(key) {
            views[key].draw();
        });
    }, 1000/60);
}());
