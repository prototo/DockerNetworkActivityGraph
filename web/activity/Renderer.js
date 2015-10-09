var Springy = require('springy');
var Canvas = require('./Canvas');

var max = { x: 0, y: 0 };
var min = { x: 0, y: 0 };
function normaliseVector(p) {
    max.x = Math.max(p.x, max.x);
    max.y = Math.max(p.y, max.y);
    min.x = Math.min(p.x, min.x);
    min.y = Math.min(p.y, min.y);

    var springy_width = max.x + Math.abs(min.x);
    var springy_height = max.y + Math.abs(min.y);

    var canvas_width = Canvas.canvas.width;
    var canvas_height = Canvas.canvas.height;

    var real_x = (p.x + (springy_width / 2)) * (canvas_width / springy_width);
    var real_y = (p.y + (springy_height / 2)) * (canvas_height / springy_height);

    return { x: real_x, y: real_y };
}

function drawEdge(edge, p1, p2) {
    var v1 = normaliseVector(p1);
    var v2 = normaliseVector(p2);
    edge.data.view.draw(v1, v2);
}

function drawNode(node, p) {
    var view = node.data.view;
    if (view) {
        view.draw(normaliseVector(p));
    }
}

function Renderer(layout) {
    var renderer = new Springy.Renderer(
        layout,
        Canvas.context.clear,
        drawEdge,
        drawNode
    );

    return renderer;
}

module.exports = Renderer;
