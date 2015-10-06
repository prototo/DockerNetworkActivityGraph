(function() {
    var canvas = document.getElementById('map');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "rgb(200,0,0)";

    function genColour(r, g, b) {
        function part() {
            return parseInt(Math.random()*180);
        }
        return ['rgb(', [r || part(), g || part(), b || part()].join(','), ')'].join('');
    }

    function Node(meta) {
        var x = Math.floor(Math.random()*canvas.width);
        var y = Math.floor(Math.random()*canvas.height);

        return {
            name: meta.name,
            x: x,
            y: y
        }
    }

    function NodeView(node) {
        var colour = genColour();

        function draw() {
            var circle = new Path2D();
            // circle.moveTo(x, y);
            circle.arc(node.x, node.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = colour;
            ctx.fill(circle);

            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(node.name, node.x, node.y + 20);
        }

        return draw;
    }

    function PathView(na, nb) {
        var ttl = 0;

        function draw() {
            ttl += 51;

            ctx.beginPath();
            ctx.strokeStyle = genColour(255, ttl, ttl);
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();

            return ttl < 255;
        }

        return draw;
    }

    var nodes = {};
    var views = [];
    var paths = {};

    var socket = io();
    socket.on('containers', function(message) {
        for (var x = 0; x < message.length; x++) {
            var node = Node(message[x]);
            var nodeView = NodeView(node);
            nodes[node.name] = node;
            views.push(nodeView);

            nodeView();
        }
    });
    socket.on('activity', function(ping) {
        // one container sent something somewhere?
        // flash it in the UI or something
        // build any connections we haven't seen before

        var id = ping['name'] + ping['to'];
        var path = paths[id];

        if (!path) {
            var na = nodes[ping['name']];
            var nb = nodes[ping['to']];
            path = PathView(na, nb);
            paths[id] = path;
        }
    });

    setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pathKeys = Object.keys(paths);
        for (var x = 0; x < pathKeys.length; x++) {
            var key = pathKeys[x];
            if (!paths[key]()) {
                delete(paths[key]);
            }
        }

        for (var x = 0; x < views.length; x++) {
            views[x]();
        }
    }, 50);
})();
