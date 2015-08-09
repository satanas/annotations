'use strict';

import koa from 'koa';
import hbs from 'koa-hbs';
import serve from 'koa-static';
import _ from 'koa-route';
import bodyParser from 'koa-bodyparser';
import koaBody from 'koa-body';
import * as tuit from './models/tuit';
import {read} from './file';
import path from 'path';

const app = koa();

app.use(serve(path.join(__dirname, 'public')));
app.use(bodyParser());

app.use(hbs.middleware({
  viewPath: path.join(__dirname, '/views'),
  partialsPath: path.join(__dirname, '/views/partials')
}));

app.use(function* (next) {
  const start = new Date();
  yield next;
  const end = new Date();

  console.log(`${this.ip} :: ${this.method} – ${this.url} processed in ${end-start} ms`);
});

app.use(_.get('/', function* (next) {
  const tuits = yield tuit.getAll();
  const template = yield read('views/partials/tuits.hbs');
  yield this.render('main', {
    tuits: tuits,
    template: template
  });
}));

app.use(_.put('/tweets', function* (next) {
  try {
    const tuits = yield tuit.create(this.request.body.user, this.request.body.body);
    console.log('utiutiutiut', tuits);
    this.response.status = 201;
    this.response.body = tuits;
  } catch (exception) {
    console.log(exception);
    this.response.status = 400;
    this.response.body = 'Error en el request';
  }
}));

//app.use(function* (next) {
//  this.body = 'hola';
//  yield next;
//});
//
//app.use(function* () {
//  this.body += ' a todos';
//});

app.listen(3000);
