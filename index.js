'use strict'

var express = require('express');
var app = express();
var fetch = require('node-fetch');
var https = require('https');
var alert = require('alert')
const cors = require('cors')

var corsOptions = {
  origin: ['http://localhost:3000', 'https://theo-oriol.github.io/coursUM320202021-M2/'],
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.static("public"), cors(corsOptions));

var script_state = require('./js/script_state.js');
var root_state_covid = require('./js/root_state_covid.js');
var state_list = require('./js/data.js');

const port = process.env.PORT || 3000 ;


app.get("/etat/:etat/ville/:ville", function(req, res){
    let ville = req.params.ville;
    let etat = req.params.etat;
    var info_ville = script_state.init(ville, etat);
    info_ville.then((value) => {
      res.format({
        'application/json' : function() {
          res.json(value);
        }
      })
    })
})


app.get("*", function(req, res){
  res.redirect("/")
  alert("Bad request, 404 error")
  });



app.get("/etat/:etat", function(req, res){
    let state = req.params.etat;
    var info_state = root_state_covid.root_state_covid(state);
    info_state.then((value) => {
      res.format({
        'application/json' : function() {
          res.json(value);
        }
      })

      });
})

app.get("/state_list", function(req, res){
    res.format({
      'application/json' : function() {
        res.json(state_list);
      }
    })
})

app.get("*", function(req, res){
  res.sendFile(__dirname + "/public/index.html")
  alert("Bad request, Erreur 404")
  });

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);

});
