'use strict';

import co from 'co';
import mongoose from 'mongoose';
//import {read, write} from '../file';
import Firebase from 'firebase';

let myDataRef = new Firebase('https://ndazpsjbpsq.firebaseio-demo.com/');

let tuitSchema = mongoose.Schema({
  user: String,
  body: String
});

let Tuit = mongoose.model('Tuit', tuitSchema);

export function getAll() {
  return Tuit.find();
}

export function create(user, text, options={}) {
  return co(function* () {
    if (user === undefined || user === '' || text === undefined || text === '') {
      throw 'Parámetros inválidos';
    }

    try {
      //var lis = new Tuit({ user: user, body: text });
      //yield lis.save();
      //return getAll();
      myDataRef.push({user: user, body: text});
      return true;
    } catch (exc) {
      console.trace(err);
      throw 'error guardando tuit: ' + err;
    }
  });
}


/*
const path = 'tuits.json';

export function getAll() {
  return new Promise(function(resolve, reject) {
    read(path).then(function(result) {
      resolve(result);
    }).catch(function() {
      reject();
    });
  });
}

export function create(user, text, options={}) {
  return co(function* () {
    let data = yield read(path, options);
    data = JSON.parse(data);
    if (user === undefined || user === '' || text === undefined || text === '') {
      throw 'Parámetros inválidos';
    }
    data.push({user: user, body: text});
    yield write(path, JSON.stringify(data), options);
    return data;
  });
};
*/
