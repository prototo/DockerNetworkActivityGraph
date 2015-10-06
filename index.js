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

// =============================================================================
//  INSPECT
// =============================================================================
var Inspect = require('./inspect');
var containers = [];
Inspect.listContainers(function(err, result) {
  containers = result;
});

// =============================================================================
//  ACTIVITY
// =============================================================================
var Activity = require('./activity');
var re = /(\d+\.\d+\.\d+\.\d+)\.(\d+)[^\d]+(\d+\.\d+\.\d+\.\d+)\.(\d+)/g;
var activity_stream;
Activity.getActivityStream(function(err, _stream) {
  if (err) {
    console.error(err);
    return err;
  }

  _stream.setEncoding('utf8');
  activity_stream = _stream;
});

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

    while (undefined === activity_stream) {}

    socket.emit('containers', containers);
    activity_stream.on('data', function(chunk) {
      var packets = chunk.split('\n');
      packets.forEach(function(packet) {
        var match = re.exec(packet);
        if (match) {
          socket.emit('activity', {
            src_ip: match[1], src_port: match[2],
            dst_ip: match[3], dst_port: match[4]
          });
        }
      });
    });
});


// =============================================================================
// START THE SERVER
// =============================================================================
server.listen(3000, function(){
  console.log('listening on *:3000');
});
