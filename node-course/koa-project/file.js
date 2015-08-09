'use strict';

import fs from 'fs';

export function read(path, options={}) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, options, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}

export function write(path, data, options={}) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, data, options, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
