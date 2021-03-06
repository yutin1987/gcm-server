var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var redis = require("redis");
var client = redis.createClient();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/token', function (req, res) {
  var deviceToken = req.body.deviceToken;
  client.set('token:'+deviceToken, Date.now(), function (err, reply) {
    console.log('save', deviceToken, err ? 'failed!' : 'ok!');
  });
  res.send('Hello Token!');
});

app.post('/push', function (req, res) {
  var body = JSON.stringify(req.body);
  console.log(body);
  client.lpush('message', body, function (err, reply) {
    console.log('push', body, err ? 'failed!' : 'ok!');
  });
  client.lpush('message:socket', body, function (err, reply) {
    console.log('push', body, err ? 'failed!' : 'ok!');
  });
  res.send('Hello Push!');
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});