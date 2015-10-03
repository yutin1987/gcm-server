var redis = require("redis");
var client = redis.createClient();

var server = require('http').createServer();
var io = require('socket.io')(server);

var listen = function() {
  client.brpop('message:socket', '0', function(err, reply) {
    if (!err && reply[1]) {
      var body = reply[1];
      
      console.log('snet', body);
      
      io.sockets.emit('message', body);
    } else {
      console.log('message', err);
    }

    setTimeout(listen);
  });
}

io.on('connection', function(socket){
  console.log('connection');
  
  socket.on('hello', function(){
    socket.emit('hello', '巨獸搖滾5.0');
  });
  socket.on('disconnect', function(){
    console.log('disconnect');
  });
});
server.listen(3000);