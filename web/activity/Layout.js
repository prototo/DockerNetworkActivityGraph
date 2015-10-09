var Springy = require('springy');

function Layout(graph) {
    var layout = new Springy.Layout.ForceDirected(
        graph,
        50.0, // Spring stiffness
        500.0, // Node repulsion
        0.5 // Damping
    );

    return layout;
}

module.exports = Layout;
