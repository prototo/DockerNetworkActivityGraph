var express = require('express');
var http = require('http');
var io = require('socket.io');
var ss = require('socket.io-stream');
var fs = require('fs');

// =============================================================================
//  SERVER
// =============================================================================
var app = express();
app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});
app.use(express.static('web'));
var server = http.createServer(app);

/**
 * Zip function to turn httpry logs into something usful
 */
var packet_parts = ['source_ip', 'source_port', 'direction', 'dest_ip', 'dest_port', 'method', 'request_uri', 'status_code'];
function processPacket(packet) {
  var zipped = {};
  packet = packet.split(/\s+/);

  for (var index = 0; index < packet_parts.length; index++) {
    zipped[packet_parts[index]] = packet[index] === undefined || packet[index] === '-' ? null : packet[index];
  }

  return zipped;
}

// =============================================================================
//  INSPECT
// =============================================================================
var Inspect = require('./inspect');
Inspect.listContainers(function(err, containers) {
  if (err) {
    console.error(err);
    return err;
  }
  console.log('got ' + containers.length + ' containers');

  // =============================================================================
  //  ACTIVITY
  // =============================================================================
  var Activity = require('./activity');
  Activity.getActivityStream(function(err, stream) {
    if (err) {
      console.error(err);
      return err;
    }
    console.log('got activity stream');

    stream.setEncoding('utf8');
    startServer(containers, stream);
  });
});

function startServer(containers, activity_stream) {
  // =============================================================================
  //  SOCKET.IO
  // =============================================================================
  ioserver = io(server);
  ioserver.on('connection', function(socket){
      var user = (new Date()).getTime();
      console.log('a user connected', user);

      socket.on('disconnect', function(){
          console.log('user disconnected', user);
      });

      socket.emit('containers', containers);
      activity_stream.on('data', function(chunk) {
        var packets = chunk.split('\n');
        packets.forEach(function(packet) {
          var packet = processPacket(packet);
          socket.emit('activity', packet);
        });
      });
  });

  // =============================================================================
  // START THE SERVER
  // =============================================================================
  server.listen(3000, function(){
    console.log('listening on *:3000');
  });
}
