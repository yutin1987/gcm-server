var GCM = require('node-gcm-ccs');
var cfg = require('./config.json');
var gcm = GCM(cfg.id, cfg.key);
var redis = require("redis");
var client = redis.createClient();

gcm.on('message', function(messageId, from, category, data) {
    console.log('received message', arguments);
});

gcm.on('receipt', function(messageId, from, category, data) {
    console.log('received receipt', arguments);
});

client.brpop('message', function(err, reply) {
  if (reply[1]) {
    var message = reply[1];
    client.keys('token:*', function(err, reply) {
      reply.forEach(function(token) {
        token = token.replace(/^token:/gi, '');

        gcm.send(
          token,
          { message: message },
          { delivery_receipt_requested: true },
          function(err, messageId, to) {
            if (err) {
              console.log(token, 'failed to send message');
            }
          }
      })
    })
  }
});
