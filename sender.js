var xmpp = require('node-xmpp-client');
var crypto = require('crypto');
var redis = require("redis");
var client = redis.createClient();
var cfg = require('./config.json');

var xmpp = new xmpp.Client({
  type: 'client',
  jid: cfg.id + '@gcm.googleapis.com',
  password: cfg.key,
  port: 5235,
  host: 'gcm.googleapis.com',
  legacySSL: true,
  preferredSaslMechanism : 'PLAIN'
});

xmpp.on('stanza', function(stanza) {
    console.log('Incoming stanza: ', stanza.toString())
});

var send = function(to, message) {
  var json = {
    "to": to,
    "message_id": crypto.randomBytes(8).toString('hex'),
    "data": {"message": message},
    "time_to_live": 600
  };

  xmpp.send('<message id=""><gcm xmlns="google:mobile:data">' + JSON.stringify(json) + '</gcm></message>');
}

xmpp.on('online', function() {
  console.log('online');

  client.brpop('message', '0', function(err, reply) {
    if (!err && reply[1]) {
      var message = reply[1];
      console.log('snet', message);
      client.keys('token:*', function(err, reply) {
        reply.forEach(function(token) {
          token = token.replace(/^token:/gi, '');
          send(token, message);
        })
      })
    } else {
      console.log('message', err);
    }
  });
});
