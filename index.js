'use strict'

var express = require('express');
var app = express();
var fetch = require('node-fetch');
var https = require('https');
//var redirect = require('redirect');
var filter = require('filter');


var script_state = require('./js/script_state');
var data = require("./js/data");
var state_id = require("./js/state_id");


const port = process.env.PORT || 3000 ;

app.get("/", function(req, res){
    res.send("USA Covid-19 data State by state");
})

app.get('/state/get_state/:name', function(req, res){
  let name = req.params.name;
  state_id = state_id.get_state(name);
  res.redirect('/state/'+state_id);
})

app.get("/state/:state", function(req, res){
    let state = req.params.state;
    let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state+"/cities/";
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('fetch', json);
        // res.send('data fetched look your console');
        res.send(json);
        script_state.display_state(json);
      });

})

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
