(function() {
    var graph = new Springy.Graph();

    var exclude = ['/config_v2.4.0', '/redis_latest']

    var socket = io();
    var containers_by_ip = {};
    var containers_by_port = {};
    var views = {};

    function getContainer(ip, port) {
        return containers_by_ip[ip] || containers_by_port[port];
    }

    socket.on('containers', function(containers) {
        for (var index = 0; index < containers.length; index++) {
            var container = containers[index];

            if (exclude.indexOf(container.name) > -1) continue;

            var ip = container.ip;
            var ports = container.ports;

            containers_by_ip[ip] = container;

            for (var _index = 0; _index < ports.length; _index++) {
                var port = ports[_index];
                containers_by_port[port] = container;
            }

            container.node = graph.newNode({label: container.name});
            container.edges = {};
        }

        views = setupViews(containers);
    });

    socket.on('activity', function(ping) {
        var src = getContainer(ping.src_ip, ping.src_port);
        var dst = getContainer(ping.dst_ip, ping.dst_port);

        if (src && dst) {
            var edge = src.edges[dst.name] || graph.newEdge(src.node, dst.node);
            // if (edge.timer) clearTimeout(edge.timer);
            // edge.timer = setTimeout(function() {
            //     graph.removeEdge(edge);
            //     delete(src.edges[dst.name]);
            // }, 2000);
            if (typeof(edge.data.length) === 'undefined') edge.data.length = 10;
            else edge.data.length *= 0.9;
            src.edges[dst.name] = edge;
        }
    });

    function normaliseVector(vector) {
        // springy bounding box is bottomleft (-2, -2) topright (2, 2)
        // that means, because I'm lazy, we're probably rendering upside down
        return {
            x: Math.floor((vector.x + 15) * (canvas.width / 30)),
            y: Math.floor((vector.y + 15) * (canvas.height / 30))
        };
    }

    var layout = new Springy.Layout.ForceDirected(
        graph,
        100.0, // Spring stiffness
        50.0, // Node repulsion
        0.5 // Damping
    );

    var renderer = new Springy.Renderer(
        layout,
        clearCanvas,
        function drawEdge(edge, p1, p2) {
            var v1 = normaliseVector(p1);
            var v2 = normaliseVector(p2);
            drawLine(v1, v2);
        },
        function drawNode(node, p) {
            // draw a node
            var view = views[node.data.label];
            if (view) {
                view.draw(normaliseVector(p));
            }
        }
    );

    renderer.start();
})();
