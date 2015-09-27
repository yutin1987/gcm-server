var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var redis = require("redis"),
    client = redis.createClient()

app.use(bodyParser.json());

app.post('/token', function (req, res) {
  var deviceToken = req.body.deviceToken;
  client.set(deviceToken, Date.now(), function (err, reply) {
    console.log('save', deviceToken, err ? 'failed!' : 'ok!');
  });
  res.send('Hello Token!');
});

app.post('/psuh', function (req, res) {
  var message = req.body.message;
  console.log(message);
  client.lpush('message', 'message', function (err, reply) {
    console.log('push', message, err ? 'failed!' : 'ok!');
  });
  res.send('Hello Push!');
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});