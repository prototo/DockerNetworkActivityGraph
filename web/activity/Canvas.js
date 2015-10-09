var canvas = document.getElementById('map');
var context = canvas.getContext('2d');

context.clear = function() {
    this.fillStyle = 'white';
    this.fillRect(0, 0, canvas.width, canvas.height);
}.bind(context);

module.exports = {
    canvas: canvas,
    context: context
}
