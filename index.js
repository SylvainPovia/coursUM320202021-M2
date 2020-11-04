
'use strict'

var express = require('express');
var app = express();
var fetch = require('node-fetch');
var https = require('https');

var script_state = require('./js/script_state');

var state_list = require('./js/data.js');

const port = process.env.PORT || 3000 ;

app.get("/", function(req, res){
    res.send("USA Covid-19 data State by state");
})

app.get("/ville/:ville", function(req, res){
  let ville = req.params.ville;
  let data = info_ville[ville];
  info_ville.then((value) => {
    res.format({
      'application/json' : function() {
        res.json(value[ville]);
      }
    })
    
  });
})
var info_ville = script_state.init();

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);

});