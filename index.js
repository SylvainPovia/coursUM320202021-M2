'use strict'

var express = require('express');
var app = express();
var fetch = require('node-fetch');
var https = require('https');

var script_state = require('./js/script_state.js');
var state_id = require('./js/state_id.js');
var root_state_covid = require('./js/root_state_covid.js');
var state_list = require('./js/data.js');

const port = process.env.PORT || 3000 ;

// Gestion des routes
app.get("/", function(req, res){
    res.send("USA Covid-19");
})

app.get("ville/:ville", function(req, res){
  let ville = req.params.ville;
  info_ville.then((value) => {
    res.format({
      'application/json' : function() {
        res.json(value[ville]);
      }
    })

  });
})

app.get("/etat/:etat", function(req, res){
    let state = req.params.etat;
    state_id = state_id.get_state_id(state);
    var info_state = root_state_covid.root_state_covid(state_id);
    info_state.then((value) => {
      res.format({
        'application/json' : function() {
          res.json(value);
        }
      })

      });
})

app.get("/current_covid", function(req, res){
    let url = "https://api.covidtracking.com/v1/states/current.json";
    fetch(url)
      .then(res => res.json())
      .then(json => {

        res.format({
          'text/html' : function() {
           res.json(json);
          }
        })

      });
})



var info_ville = script_state.init();

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);

});
