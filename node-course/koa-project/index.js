require('babel/register');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.log.bind(console, 'connection error:'));

db.once('open', function(callback) {
  console.log("abierto");

  var tuitSchema = mongoose.Schema({
    user: String,
    body: String
  });

  require('./server');
});
