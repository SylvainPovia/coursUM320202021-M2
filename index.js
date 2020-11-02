'use strict'

var express = require('express');
var app = express();
var fetch = require('node-fetch');
var https = require('https');

const port = process.env.PORT || 3000 ;

app.get("/", function(req, res){
    res.send("helloWorld !");
})

app.get("/state/:state", function(req, res){
    let state = req.params.state;
    let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state+"/cities/";
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('fetch', json);
        res.send('data fetched look your console');
      });
})

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
