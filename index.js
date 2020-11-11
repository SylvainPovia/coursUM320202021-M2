'use strict'

var express = require('express')
var negotiate = require('express-negotiate');
var app = express();
var fetch = require('node-fetch');
var https = require('https');
var alert = require('alert')
const cors = require('cors')

var corsOptions = {
  origin: ['http://localhost:3000', 'https://theo-oriol.github.io/coursUM320202021-M2/', 'http://localhost'],
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.static("public"), cors(corsOptions));

var script_state = require('./js/script_state.js');
var root_state_covid = require('./js/root_state_covid.js');
var state_list = require('./js/data.js');

const port = process.env.PORT || 3000 ;


app.get("/etat/:etat/ville/:ville.:format?", function(req, res){
    let ville = req.params.ville;
    let etat = req.params.etat;
    var info_ville = script_state.init(ville, etat);
    info_ville.then((value) => {
      req.negotiate(req.params.format,{
        'application/json' : function() {
          res.json(value);
        },
        'application/xml' : function() {
          var cityjsondata = value[Object.keys(value)[0]]
          res.setHeader("Content-disposition", "attachement; filename=" + Object.keys(value)[0] + ".rdf")
          var xmlrdf = '<?xml version="1.0"?>\n'
          xmlrdf += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n'
          xmlrdf += '\t<univvoc:State>\n'
          xmlrdf += '\t\t<univvoc:hasStateID>' + cityjsondata.state +'</univvoc:hasStateID>\n'
          xmlrdf += '\t\t<univvoc:hascovidDataLastDate>' + cityjsondata.date + '</univvoc:hascovidDataLastDate>\n'
          xmlrdf += '\t\t<univvoc:hasDeaths>' + cityjsondata.death + '</univvoc:hasDeaths>\n'
          xmlrdf += '\t\t<univvoc:hasPositive>' + cityjsondata.positive + '</univvoc:hasPositive>\n'
          xmlrdf += '\t\t<univvoc:hastotalTestResultsSource>' + cityjsondata.totalTestResultsSource + '</univvoc:hastotalTestResultsSource>\n'
          xmlrdf += '\t\t<univvoc:hashospitalizedCurrently>'  + cityjsondata.hospitalizedCurrently +'</univvoc:hashospitalizedCurrently>\n'
          xmlrdf += '\t\t<univvoc:hasHousing>' + cityjsondata.Housing + '</univvoc:hasHousing>\n'
          xmlrdf += '\t\t<univvoc:hasCostofLiving>' + cityjsondata["Cost of Living"] + '</univvoc:hasCostofLiving>\n'
          xmlrdf += '\t\t<univvoc:hasStartups>' + cityjsondata.Startups + '</univvoc:hasStartups>\n'
          xmlrdf += '\t\t<univvoc:hasVentureCapital>' + cityjsondata["Venture Capital"] + '</univvoc:hasVentureCapital>\n'
          xmlrdf += '\t\t<univvoc:hasTravelConnectivity>' + cityjsondata["Travel Connectivity"] + '</univvoc:hasTravelConnectivity>\n'
          xmlrdf += '\t\t<univvoc:hasCommute>' + cityjsondata["Commute"] + '</univvoc:hasCommute>\n'
          xmlrdf += '\t\t<univvoc:hasBusinessFreedom>' + cityjsondata["Business Freedom"] + '</univvoc:hasBusinessFreedom>\n'
          xmlrdf += '\t\t<univvoc:hasSafety>' + cityjsondata["Safety"] + '</univvoc:hasSafety>\n'
          xmlrdf += '\t\t<univvoc:hasHealthcare>' + cityjsondata["Healthcare"] + '</univvoc:hasHealthcare>\n'
          xmlrdf += '\t\t<univvoc:hasEducation>' + cityjsondata["Education"] + '</univvoc:hasEducation>\n'
          xmlrdf += '\t\t<univvoc:hasEnvironmentalQuality>' + cityjsondata["Environmental Quality"] + '</univvoc:hasEnvironmentalQuality>\n'
          xmlrdf += '\t\t<univvoc:hasEconomy>' + cityjsondata["Economy"] + '</univvoc:hasEconomy>\n'
          xmlrdf += '\t\t<univvoc:hasTaxation>' + cityjsondata["Taxation"] + '</univvoc:hasTaxation>\n'
          xmlrdf += '\t\t<univvoc:hasInternetAccess>' + cityjsondata["Internet Access"] + '</univvoc:hasInternetAccess>\n'
          xmlrdf += '\t\t<univvoc:hasLeisureCulture>' + cityjsondata["Leisure & Culture"] + '</univvoc:hasLeisureCulture>\n'
          xmlrdf += '\t\t<univvoc:hasTolerance>' + cityjsondata["Tolerance"] + '</univvoc:hasTolerance>\n'
          xmlrdf += '\t\t<univvoc:hasOutdoors>' + cityjsondata["Outdoors"] + '</univvoc:hasOutdoors>\n'
          xmlrdf += '\t\t<univvoc:haspopulation>' + cityjsondata["population"] + '</univvoc:haspopulation>\n'
          xmlrdf += '\t</univvoc:State>\n'
          res.send(xmlrdf)
        }
      })
    })
})

app.get("/etat/:etat.:format?", function(req, res){
    let state = req.params.etat;
    var info_state = root_state_covid.root_state_covid(state);
    info_state.then((value) => {
      req.negotiate(req.params.format,{
        'application/json' : function() {
          res.json(value);
        },
        'application/xml': function(){
          var statejsondata = value[Object.keys(value)[0]]
          res.setHeader("Content-disposition", "attachement; filename=" + statejsondata.state + ".rdf")
          var xmlrdf = '<?xml version="1.0"?>\n'
          xmlrdf += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n'
          xmlrdf += '\t<univvoc:State>\n'
          xmlrdf += '\t\t<univvoc:hasName>' + statejsondata.state +'</univvoc:hasName>\n'
          xmlrdf += '\t\t<univvoc:hascovidDataLastDate>' + statejsondata.date + '</univvoc:hascovidDataLastDate>\n'
          xmlrdf += '\t\t<univvoc:hasDeaths>' + statejsondata.death + '</univvoc:hasDeaths>\n'
          xmlrdf += '\t\t<univvoc:hasPositive>' + statejsondata.positive + '</univvoc:hasPositive>\n'
          xmlrdf += '\t\t<univvoc:hastotalTestResultsSource>' + statejsondata.totalTestResultsSource + '</univvoc:hastotalTestResultsSource>\n'
          xmlrdf += '\t\t<univvoc:hashospitalizedCurrently>'  + statejsondata.hospitalizedCurrently +'</univvoc:hashospitalizedCurrently>\n'
          xmlrdf += '\t\t<univvoc:hasCities>' 
          statejsondata.cities.forEach(function(city) {
            xmlrdf += '\t\t\t<univvoc:City>\n'
            xmlrdf += '\t\t\t\t<univvoc:hasName>' + city + '</univvoc:hasName>\n'
            xmlrdf += '\t\t\t</univvoc:City>\n'
          })
          xmlrdf += '\t\t</univvoc:hasCities>\n'
          xmlrdf += '\t</univvoc:State>\n'
          xmlrdf += '</rdf:RDF>'
          res.send(xmlrdf)
        }
      })
      });
})

app.get("/state_list.:format?", function(req, res){
    req.negotiate(req.params.format,{
      'application/json' : function() {
        res.json(state_list);
      },
      'application/xml': function(){
        res.setHeader("Content-disposition", "attachement; filename=state_list.rdf")
        var xmlrdf = '<?xml version="1.0"?>\n'
        xmlrdf += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n'
        xmlrdf += '\t<univvoc:state_list>\n'
        xmlrdf += '\t\t<univvoc:hasState>\n'
        state_list.states_table.states_table.forEach(function(state) {
          xmlrdf += '\t\t\t<univvoc:State>\n'
          xmlrdf += '\t\t\t\t<univvoc:hasID>' + state.id + '</univvoc:hasID>\n'
          xmlrdf += '\t\t\t\t<univvoc:hasName>' + state.name + '</univvoc:hasName>\n'
          xmlrdf += '\t\t\t</univvoc:State>\n'
        })
        xmlrdf += '\t\t</univvoc:hasState>\n'
        xmlrdf += '\t</univvoc:state_list>\n'
        xmlrdf += '</rdf:RDF>'
        res.send(xmlrdf)
      }
    })
})


app.get(/^.*?(?:\.([^\.\/]+))?$/, function(req, res) {
  req.negotiate(req.params[0], {
        'json;q=0.9': function() {
          res.send({ error: 404, message: 'Not Found' }, 404);
      }
      , 'html;q=1.1,default': function() {
          res.statusCode = 404;
          res.sendFile(__dirname + "/public/index.html")
          alert("Error 404, Not Found")
      }
  });
});

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);

});
