'use strict'

var express = require('express')
var negotiate = require('express-negotiate');
var app = express();
var fetch = require('node-fetch');
var https = require('https');
var alert = require('alert')
var request = require('request')
const cors = require('cors')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.static("public"), cors(corsOptions));

var script_state = require('./js/script_state.js');
var root_state_covid = require('./js/root_state_covid.js');
var state_list = require('./js/data.js');
var state_stats = require('./js/stats_data.js')
const os = require('os');

const port = process.env.PORT || 3000 ;


app.get("/etat/:etat/ville/:ville.:format?", function(req, res){
  let ville = req.params.ville;
  let etat = req.params.etat;
  var info_ville = script_state.init(ville, etat);
  info_ville.then((value) => {
    req.negotiate(req.params.format,{
      'application/json' : function() {
        if (value =="error"){
          res.send({ error: 404, message: 'State or City not found' }, 404);
        } else {
        res.json(value);
        }
      },
      'application/xml' : function() {
        if (value =="error"){ 
          res.send("<p>There is no such couple as <b>" + ville +", "+ etat + "</b>. Try <a href="+req.headers.host+"/state_list.json>" +req.headers.host + 
          "/state_list.json</a> to see the correct state list.</p>"+
          "<p>Then, you should check if the city you want exist in the state by doing : <a href="+req.headers.host+"/etat/"+etat+"/ville/"+ville+".json>"+req.headers.host+"/etat/"+etat+"/ville/"+ville+".json</a></p>" )

        } else {
        var cityjsondata = value[Object.keys(value)[0]]
        res.setHeader("Content-disposition", "attachement; filename=" + Object.keys(value)[0] + ".rdf")
        var xmlrdf = '<?xml version="1.0"?>\n'
        xmlrdf += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n'
        xmlrdf += '\t<niceapi:State>\n'
        xmlrdf += '\t\t<niceapi:hasStateID>' + cityjsondata.state +'</niceapi:hasStateID>\n'
        xmlrdf += '\t\t<niceapi:hascovidDataLastDate>' + cityjsondata.date + '</niceapi:hascovidDataLastDate>\n'
        xmlrdf += '\t\t<niceapi:hasDeaths>' + cityjsondata.death + '</niceapi:hasDeaths>\n'
        xmlrdf += '\t\t<niceapi:hasPositive>' + cityjsondata.positive + '</niceapi:hasPositive>\n'
        xmlrdf += '\t\t<niceapi:hastotalTestResultsSource>' + cityjsondata.totalTestResultsSource + '</niceapi:hastotalTestResultsSource>\n'
        xmlrdf += '\t\t<niceapi:hashospitalizedCurrently>'  + cityjsondata.hospitalizedCurrently +'</niceapi:hashospitalizedCurrently>\n'
        xmlrdf += '\t\t<niceapi:hasHousing>' + cityjsondata.Housing + '</niceapi:hasHousing>\n'
        xmlrdf += '\t\t<niceapi:hasCostofLiving>' + cityjsondata["Cost of Living"] + '</niceapi:hasCostofLiving>\n'
        xmlrdf += '\t\t<niceapi:hasStartups>' + cityjsondata.Startups + '</niceapi:hasStartups>\n'
        xmlrdf += '\t\t<niceapi:hasVentureCapital>' + cityjsondata["Venture Capital"] + '</niceapi:hasVentureCapital>\n'
        xmlrdf += '\t\t<niceapi:hasTravelConnectivity>' + cityjsondata["Travel Connectivity"] + '</niceapi:hasTravelConnectivity>\n'
        xmlrdf += '\t\t<niceapi:hasCommute>' + cityjsondata["Commute"] + '</niceapi:hasCommute>\n'
        xmlrdf += '\t\t<niceapi:hasBusinessFreedom>' + cityjsondata["Business Freedom"] + '</niceapi:hasBusinessFreedom>\n'
        xmlrdf += '\t\t<niceapi:hasSafety>' + cityjsondata["Safety"] + '</niceapi:hasSafety>\n'
        xmlrdf += '\t\t<niceapi:hasHealthcare>' + cityjsondata["Healthcare"] + '</niceapi:hasHealthcare>\n'
        xmlrdf += '\t\t<niceapi:hasEducation>' + cityjsondata["Education"] + '</niceapi:hasEducation>\n'
        xmlrdf += '\t\t<niceapi:hasEnvironmentalQuality>' + cityjsondata["Environmental Quality"] + '</niceapi:hasEnvironmentalQuality>\n'
        xmlrdf += '\t\t<niceapi:hasEconomy>' + cityjsondata["Economy"] + '</niceapi:hasEconomy>\n'
        xmlrdf += '\t\t<niceapi:hasTaxation>' + cityjsondata["Taxation"] + '</niceapi:hasTaxation>\n'
        xmlrdf += '\t\t<niceapi:hasInternetAccess>' + cityjsondata["Internet Access"] + '</niceapi:hasInternetAccess>\n'
        xmlrdf += '\t\t<niceapi:hasLeisureCulture>' + cityjsondata["Leisure & Culture"] + '</niceapi:hasLeisureCulture>\n'
        xmlrdf += '\t\t<niceapi:hasTolerance>' + cityjsondata["Tolerance"] + '</niceapi:hasTolerance>\n'
        xmlrdf += '\t\t<niceapi:hasOutdoors>' + cityjsondata["Outdoors"] + '</niceapi:hasOutdoors>\n'
        xmlrdf += '\t\t<niceapi:haspopulation>' + cityjsondata["population"] + '</niceapi:haspopulation>\n'
        xmlrdf += '\t</niceapi:State>\n'
        res.send(xmlrdf)
      }
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
        if (value =="error"){
          res.send({ error: 404, message: 'State not found' }, 404);
        } else {
        res.json(value);
        }
      },
      'application/xml': function(){
        if (value =="error"){ 
          res.send("<p><b>" + state + "</b> doesn't exist. Try <a href="+req.headers.host+"/state_list.json>" +req.headers.host + 
          "/state_list.json</a> to see the correct state list.</p>"+
          "<p>You can also try with a .xml at the end if you want to get an xml+rdf file.</p>")
        } else {
          var statejsondata = value[Object.keys(value)[0]]
          res.setHeader("Content-disposition", "attachement; filename=" + statejsondata.state + ".rdf")
          var xmlrdf = '<?xml version="1.0"?>\n'
          xmlrdf += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n'
          xmlrdf += '\t<niceapi:State>\n'
          xmlrdf += '\t\t<niceapi:hasName>' + statejsondata.state +'</niceapi:hasName>\n'
          xmlrdf += '\t\t<niceapi:hascovidDataLastDate>' + statejsondata.date + '</niceapi:hascovidDataLastDate>\n'
          xmlrdf += '\t\t<niceapi:hasDeaths>' + statejsondata.death + '</niceapi:hasDeaths>\n'
          xmlrdf += '\t\t<niceapi:hasPositive>' + statejsondata.positive + '</niceapi:hasPositive>\n'
          xmlrdf += '\t\t<niceapi:hastotalTestResultsSource>' + statejsondata.totalTestResultsSource + '</niceapi:hastotalTestResultsSource>\n'
          xmlrdf += '\t\t<niceapi:hashospitalizedCurrently>'  + statejsondata.hospitalizedCurrently +'</niceapi:hashospitalizedCurrently>\n'
          xmlrdf += '\t\t<niceapi:hasCities>' 
          statejsondata.cities.forEach(function(city) {
            xmlrdf += '\t\t\t<niceapi:City>\n'
            xmlrdf += '\t\t\t\t<niceapi:hasName>' + city + '</niceapi:hasName>\n'
            xmlrdf += '\t\t\t</niceapi:City>\n'
          })
          xmlrdf += '\t\t</niceapi:hasCities>\n'
          xmlrdf += '\t</niceapi:State>\n'
          xmlrdf += '</rdf:RDF>'
          res.send(xmlrdf)
        }
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
        xmlrdf += '\t<niceapi:state_list>\n'
        xmlrdf += '\t\t<niceapi:hasState>\n'
        state_list.states_table.states_table.forEach(function(state) {
          xmlrdf += '\t\t\t<niceapi:State>\n'
          xmlrdf += '\t\t\t\t<niceapi:hasID>' + state.id + '</niceapi:hasID>\n'
          xmlrdf += '\t\t\t\t<niceapi:hasName>' + state.name + '</niceapi:hasName>\n'
          xmlrdf += '\t\t\t</niceapi:State>\n'
        })
        xmlrdf += '\t\t</niceapi:hasState>\n'
        xmlrdf += '\t</niceapi:state_list>\n'
        xmlrdf += '</rdf:RDF>'
        res.send(xmlrdf)
      }
    })
})


app.get("/state_stats", function(req, res){
  var stats_info = state_stats.state_stats();
  req.negotiate({
    'application/json' : function() {
      stats_info.then(function(value){res.json(value);})
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
