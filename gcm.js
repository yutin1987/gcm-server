"use strict";

var xmpp = require('node-xmpp-client');
var cfg = require('./config.json');
var crypto = require('crypto');

var client = new xmpp.Client({
  type: 'client',
  jid: cfg.id + '@gcm.googleapis.com',
  password: cfg.key,
  port: 5235,
  host: 'gcm.googleapis.com',
  legacySSL: true,
  preferredSaslMechanism : 'PLAIN'
});

client.on('online', function() {
    console.log('online');
    var json = {
      "to": "APA91bHspFT5doLhNwfbOC62w9WvHqIjg4rot1bpkFL9ke12oYrKvWm-fM3N5W1a6zra4gb5mfrioHBTaXBY_IgzlCTHvhoMmSHNyQE6tyH-aJIRZfz2L7HnGkPYi9o3e5rlEF1_wyBBdFy2Snd2T4BnW5MDW-EbSg",
      "message_id": crypto.randomBytes(8).toString('hex'),
      "data": {"message": "hello world"},
      "time_to_live": 600
    };

    client.send('<message id=""><gcm xmlns="google:mobile:data">' + JSON.stringify(json) + '</gcm></message>');
})

client.on('stanza', function(stanza) {
    console.log('Incoming stanza: ', stanza.toString())
})