/*global $*/
'use strict';

import {put} from 'axios';
import tuitsTemplate from '../../views/partials/tuits.hbs';

$(document).ready(function() {
  $('#send').click(function(event) {
    let user = $('#user').val();
    let body = $('#body').val();
    put('/tweets', {
      user: user,
      body: body
    })
    .then(function(response) {
      //renderTuits(response.data);
    })
    .catch(function(response) {
      let flash = $('#flash');
      flash.text(response.data);
      flash.addClass('alert');
      flash.show();
      flash.animate({alpha: 0}, 2000, 'swing', function() {
        flash.hide();
        flash.removeClass('alert');
      });
    });
  });
});

function renderTuits(tuits) {
  let newHtml = tuitsTemplate({tuits: tuits});
  $('#tuits').html(newHtml);
  $('form :input').val("");
  let flash = $('#flash');
  flash.text('Tuit creado');
  flash.addClass('success');
  flash.show();
  flash.animate({alpha: 0}, 2000, 'swing', function() {
    flash.hide();
    flash.removeClass('success');
  });
}

let myDataRef = new Firebase('https://ndazpsjbpsq.firebaseio-demo.com/');

myDataRef.on('value', collection => {
  //console.log('value', collection.val());
  renderTuits(collection.val());
});

//myDataRef.on('child_added', snapshot => {
//  console.log('child_added', snapshot.val());
//});
