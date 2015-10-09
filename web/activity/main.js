var SocketIO = require('socket.io-client');

var ContainerView = require('./ContainerView.js');
var EdgeView = require('./EdgeView.js')

var socket = SocketIO();

var Graph = require('./Graph.js');
var graph;

var Layout = require('./Layout.js');
var layout;

var Renderer = require('./Renderer.js');
var renderer;

var containers = [];

function getContainer(ip, port) {
    var container;
    for (var index = 0; index < containers.length; index++) {
        container = containers[index];
        if (
            ip === container.ip
            || container.ports.indexOf(port) > -1
        ) {
            return container;
        }
    }
    return null;
}

var exclude = ['/config_v2.4.0', '/redis_latest'];
function setupGraph(containers) {
    var graph = new Graph();

    containers.forEach(function(container) {
        if (exclude.indexOf(container.name) > -1) return;

        var node = graph.newNode({
            label: container.name,
            container: container,
            edges: {}
        });

        // uuuuuuuuuhhhhhhhhhhhHHHHHHHHHH
        container.node = node;
    });

    return graph;
}

function setupRenderer(graph) {
    graph.nodes.forEach(function(node) {
        node.data.view = new ContainerView({}, node.data.container);
    });

    layout = new Layout(graph);
    return new Renderer(layout);
}

socket.on('containers', function(__containers) {
    containers = __containers;
    graph = setupGraph(containers);
    renderer = setupRenderer(graph);
    renderer.start();
});

socket.on('activity', function(ping) {
    var source = getContainer(ping.source_ip, ping.source_port);
    var dest = getContainer(ping.dest_ip, ping.dest_port);

    if (source && dest) {
        var source_node = source.node;
        var dest_node = dest.node;

        if (source_node && dest_node) {
            var edge = source_node.data.edges[dest.name] || dest_node.data.edges[source.name];
            // not an existing edge
            if (!edge) {
                var edge = graph.newEdge(source_node, dest_node, {
                    view: new EdgeView()
                });
                source_node.data.edges[dest.name] = edge;
            } else {
                // show activity on that edge
                edge.data.view.flash();
            }
        }
    }
});

// function setupViews(containers) {
//     containers.forEach(function(container) {
//         views[container.name] = new ContainerView(
//             { },
//             container
//         );
//     });

//     return views;
// }
