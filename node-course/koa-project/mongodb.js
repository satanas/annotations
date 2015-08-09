'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));

db.once('open', function(callback) {
  console.log("MongoDB connected");
  var kittySchema = mongoose.Schema({
    name: String
  });

  kittySchema.methods.speak = function() {
    var greeting = this.name ? 'Meow name is ' + this.name : 'I don\'t have a name';
    console.log(greeting);
    return 0;
  }

  var Kitten = mongoose.model('Kitten', kittySchema);

  var pepito = new Kitten({ name: 'Pepito' });

  console.log(pepito.speak());
  pepito.save();
});
