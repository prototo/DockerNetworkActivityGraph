var canvas = document.getElementById('map');
var context = canvas.getContext('2d');
var views = {};

var Colour = function(r, g, b, a) {
    if ('undefined' === typeof(a)) {
        a = 1;
    }

    var fade_timer;
    this.fade = function() {
        if (a === 0) return;

        if (fade_timer) {
            clearInterval(fade_timer);
        }

        fade_timer = setInterval(function() {
            if (a > 0) a -= 0.1;
            else clearInterval(fade_timer);
        }, 50);
    }

    this.toString = function() {
        return ['rgba(', [r, g, b, a].join(', '), ')'].join('');
    }
}

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
    this.background = new Colour(Math.floor(255*Math.random()), Math.floor(255*Math.random()), Math.floor(255*Math.random()), 1);
    this.stroke_colour = options.stroke_colour || 'black';
    this.stroke_weight = options.stroke_weight || 2;

    this.font = "12px sans-serif";
    this.textAlign = "center";

    // draw function for ContainerView. Draws a circle. Radical.
    this.draw = function(vector) {
        var circle = new Path2D();
        circle.arc(vector.x, vector.y, this.width, 0, 2 * Math.PI);

        // draw that circle, so good
        context.fillStyle = this.background.toString();
        context.fill(circle);
        context.strokeStyle = this.stroke_colour;
        context.lineWidth = this.stroke_weight;
        context.stroke(circle);

        // render the container name
        context.fillStyle = 'black';
        context.textAlign = this.textAlign;
        context.fillText(
            this.container.name,
            vector.x,
            vector.y + 20
        );
    }.bind(this);

    this.flash = function() {
        this.background = new Colour(255, 0, 0);
        this.background.fade();
    }
};

function drawLine(vector1, vector2) {
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(vector1.x, vector1.y);
    context.lineTo(vector2.x, vector2.y);
    context.stroke();
}

function setupViews(containers) {
    containers.forEach(function(container) {
        views[container.name] = new ContainerView(
            { },
            container
        );
    });

    return views;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
