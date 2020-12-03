`use strict`

var express = require(`express`)
var negotiate = require(`express-negotiate`);
var app = express();
var fetch = require(`node-fetch`);
var https = require(`https`);
var alert = require(`alert`)
var request = require(`request`)
const cors = require(`cors`)

var corsOptions = {
  origin: `*`,
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.static("public"), cors(corsOptions));

var script_state = require(`./js/script_state.js`);
var root_state_covid = require(`./js/root_state_covid.js`);
var state_list = require(`./js/data.js`);
var state_stats = require(`./js/stats_data.js`)
const os = require(`os`);

const port = process.env.PORT || 3000 ;


app.get("/state/:state/city/:city.:format?", function(req, res){
  let ville = req.params.city;
  let etat = req.params.state;
  var info_ville = script_state.init(ville, etat);
  info_ville.then((value) => {
    req.negotiate(req.params.format,{
      "application/json" : function() {
        if (value =="error"){
          res.send({ error: 404, message: `State or City not found` }, 404);
        } else {
        res.json(value);
        }
      },
      "application/xml" : function() {
        if (value =="error"){ 
          res.send("<p>There is no such couple as <b>" + ville +", "+ etat + "</b>. Try <a href="+req.headers.host+"/state_list.json>" +req.headers.host + 
          "/state_list.json</a> to see the correct state list.</p>"+
          "<p>Then, you should check if the city you want exist in the state by doing : <a href="+req.headers.host+"/etat/"+etat+"/ville/"+ville+".json>"+req.headers.host+"/etat/"+etat+"/ville/"+ville+".json</a></p>" )

        } else {
        var cityjsondata = value[Object.keys(value)[0]]
        res.setHeader("Content-disposition", "attachement; filename=" + Object.keys(value)[0] + ".rdf")
        var xmlrdf = `<?xml version="1.0"?>\n`
        xmlrdf += `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n`
        xmlrdf += `\t<niceapi:Ville>\n`
        xmlrdf += `\t\t<niceapi:hasStateID>` + cityjsondata.state +`</niceapi:hasStateID>\n`
        xmlrdf += `\t\t<niceapi:hascovidDataLastDate>` + cityjsondata.date + `</niceapi:hascovidDataLastDate>\n`
        xmlrdf += `\t\t<niceapi:hasDeaths>` + cityjsondata.death + `</niceapi:hasDeaths>\n`
        xmlrdf += `\t\t<niceapi:hasPositive>` + cityjsondata.positive + `</niceapi:hasPositive>\n`
        xmlrdf += `\t\t<niceapi:hastotalTestResultsSource>` + cityjsondata.totalTestResultsSource + `</niceapi:hastotalTestResultsSource>\n`
        xmlrdf += `\t\t<niceapi:hashospitalizedCurrently>`  + cityjsondata.hospitalizedCurrently +`</niceapi:hashospitalizedCurrently>\n`
        xmlrdf += `\t\t<niceapi:hasHousing>` + cityjsondata.Housing + `</niceapi:hasHousing>\n`
        xmlrdf += `\t\t<niceapi:hasCostofLiving>` + cityjsondata["Cost of Living"] + `</niceapi:hasCostofLiving>\n`
        xmlrdf += `\t\t<niceapi:hasStartups>` + cityjsondata.Startups + `</niceapi:hasStartups>\n`
        xmlrdf += `\t\t<niceapi:hasVentureCapital>` + cityjsondata["Venture Capital"] + `</niceapi:hasVentureCapital>\n`
        xmlrdf += `\t\t<niceapi:hasTravelConnectivity>` + cityjsondata["Travel Connectivity"] + `</niceapi:hasTravelConnectivity>\n`
        xmlrdf += `\t\t<niceapi:hasCommute>` + cityjsondata["Commute"] + `</niceapi:hasCommute>\n`
        xmlrdf += `\t\t<niceapi:hasBusinessFreedom>` + cityjsondata["Business Freedom"] + `</niceapi:hasBusinessFreedom>\n`
        xmlrdf += `\t\t<niceapi:hasSafety>` + cityjsondata["Safety"] + `</niceapi:hasSafety>\n`
        xmlrdf += `\t\t<niceapi:hasHealthcare>` + cityjsondata["Healthcare"] + `</niceapi:hasHealthcare>\n`
        xmlrdf += `\t\t<niceapi:hasEducation>` + cityjsondata["Education"] + `</niceapi:hasEducation>\n`
        xmlrdf += `\t\t<niceapi:hasEnvironmentalQuality>` + cityjsondata["Environmental Quality"] + `</niceapi:hasEnvironmentalQuality>\n`
        xmlrdf += `\t\t<niceapi:hasEconomy>` + cityjsondata["Economy"] + `</niceapi:hasEconomy>\n`
        xmlrdf += `\t\t<niceapi:hasTaxation>` + cityjsondata["Taxation"] + `</niceapi:hasTaxation>\n`
        xmlrdf += `\t\t<niceapi:hasInternetAccess>` + cityjsondata["Internet Access"] + `</niceapi:hasInternetAccess>\n`
        xmlrdf += `\t\t<niceapi:hasLeisureCulture>` + cityjsondata["Leisure & Culture"] + `</niceapi:hasLeisureCulture>\n`
        xmlrdf += `\t\t<niceapi:hasTolerance>` + cityjsondata["Tolerance"] + `</niceapi:hasTolerance>\n`
        xmlrdf += `\t\t<niceapi:hasOutdoors>` + cityjsondata["Outdoors"] + `</niceapi:hasOutdoors>\n`
        xmlrdf += `\t\t<niceapi:haspopulation>` + cityjsondata["population"] + `</niceapi:haspopulation>\n`
        xmlrdf += `\t</niceapi:Ville>\n`
        res.send(xmlrdf)
      }
      }
    })
  })
})

app.get("/state/:state.:format?", function(req, res){
  let state = req.params.state;
  var info_state = root_state_covid.root_state_covid(state);
  info_state.then((value) => {
    req.negotiate(req.params.format,{
      "application/json" : function() {
        if (value =="error"){
          res.send({ error: 404, message: `State not found` }, 404);
        } else {
        res.json(value);
        }
      },
      "application/xml": function(){
        if (value =="error"){ 
          res.send("<p><b>" + state + "</b> doesn`t exist. Try <a href="+req.headers.host+"/state_list.json>" +req.headers.host + 
          "/state_list.json</a> to see the correct state list.</p>"+
          "<p>You can also try with a .xml at the end if you want to get an xml+rdf file.</p>")
        } else {
          var statejsondata = value[Object.keys(value)[0]]
          res.setHeader("Content-disposition", "attachement; filename=" + statejsondata.state + ".rdf")
          var xmlrdf = `<?xml version="1.0"?>\n`
          xmlrdf += `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n`
          xmlrdf += `\t<niceapi:Etat>\n`
          xmlrdf += `\t\t<niceapi:hasName>` + statejsondata.state +`</niceapi:hasName>\n`
          xmlrdf += `\t\t<niceapi:hascovidDataLastDate>` + statejsondata.date + `</niceapi:hascovidDataLastDate>\n`
          xmlrdf += `\t\t<niceapi:hasDeaths>` + statejsondata.death + `</niceapi:hasDeaths>\n`
          xmlrdf += `\t\t<niceapi:hasPositive>` + statejsondata.positive + `</niceapi:hasPositive>\n`
          xmlrdf += `\t\t<niceapi:hastotalTestResultsSource>` + statejsondata.totalTestResultsSource + `</niceapi:hastotalTestResultsSource>\n`
          xmlrdf += `\t\t<niceapi:hashospitalizedCurrently>`  + statejsondata.hospitalizedCurrently +`</niceapi:hashospitalizedCurrently>\n`
          xmlrdf += `\t\t<niceapi:hasCities>` 
          statejsondata.cities.forEach(function(city) {
            xmlrdf += `\t\t\t<niceapi:City>\n`
            xmlrdf += `\t\t\t\t<niceapi:hasName>` + city + `</niceapi:hasName>\n`
            xmlrdf += `\t\t\t</niceapi:City>\n`
          })
          xmlrdf += `\t\t</niceapi:hasCities>\n`
          xmlrdf += `\t</niceapi:Etat>\n`
          xmlrdf += `</rdf:RDF>`
          res.send(xmlrdf)
        }
      }
    })
  });
})

app.get("/state_list.:format?", function(req, res){
    req.negotiate(req.params.format,{
      "application/json" : function() {
        res.json(state_list);
      },
      "application/xml": function(){
        res.setHeader("Content-disposition", "attachement; filename=state_list.rdf")
        var xmlrdf = `<?xml version="1.0"?>\n`
        xmlrdf += `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n`
        xmlrdf += `\t<niceapi:state_list>\n`
        xmlrdf += `\t\t<niceapi:hasState>\n`
        state_list.states_table.states_table.forEach(function(state) {
          xmlrdf += `\t\t\t<niceapi:State>\n`
          xmlrdf += `\t\t\t\t<niceapi:hasID>` + state.id + `</niceapi:hasID>\n`
          xmlrdf += `\t\t\t\t<niceapi:hasName>` + state.name + `</niceapi:hasName>\n`
          xmlrdf += `\t\t\t</niceapi:State>\n`
        })
        xmlrdf += `\t\t</niceapi:hasState>\n`
        xmlrdf += `\t</niceapi:state_list>\n`
        xmlrdf += `</rdf:RDF>`
        res.send(xmlrdf)
      }
    })
})


app.get("/state_stats", function(req, res){
  var stats_info = state_stats.state_stats();
  req.negotiate({
    "application/json" : function() {
      stats_info.then(function(value){res.json(value);})
    }
  })
})

app.get("/rdf_vocabulary", function(req, res){
  req.negotiate({
    "application/xml" : function() {
      res.setHeader("Content-disposition", "attachement; filename=rdf_vocabulary.rdf")
      var xmlrdf = `<?xml version="1.0"?>\n`
      xmlrdf += `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:dc="https://www.dublincore.org/specifications/dublin-core/usageguide/2005-11-07/elements/">\n`    
      
      // Définition des classes
      // Class Etat 
      xmlrdf += `\t<rdfs:Class rdf:about="${req.headers.host}/rdf_vocabulary#Etat">\n`
      xmlrdf += `\t\t<rdfs:label xml:lang="en">Etat</rdfs:label>\n`
      xmlrdf += `\t\t<rdfs:comment xml:lang="fr">Un Etat des Etats-Unis</rdfs:comment>\n`
      xmlrdf += `\t</rdfs:Class>\n`
      xmlrdf += `\n`

      // Class ZoneUrbaine
      xmlrdf += `\t<rdfs:Class rdf:about="${req.headers.host}/rdf_vocabulary#ZoneUrbaine">\n`
      xmlrdf += `\t\t<rdfs:label xml:lang="en">ZoneUrbaine</rdfs:label>\n`
      xmlrdf += `\t\t<rdfs:comment xml:lang="fr">Une ZoneUrbaine dans un Etat des Etats-Unis</rdfs:comment>\n`
      xmlrdf += `\t</rdfs:Class>\n`
      xmlrdf += `\n`

      // Class Ville
      xmlrdf += `\t<rdfs:Class rdf:about="${req.headers.host}/rdf_vocabulary#Ville">\n`
      xmlrdf += `\t\t<rdfs:label xml:lang="en">Ville</rdfs:label>\n`
      xmlrdf += `\t\t<rdfs:comment xml:lang="fr">Une Ville dans une ZoneUrbaine dans un Etat des Etats-Unis</rdfs:comment>\n`
      xmlrdf += `\t</rdfs:Class>\n`
      xmlrdf += `\n`

      // Définition des propriétés
      // relation Etat
      // relation Etat vers Ville
      
      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasVille" rdfs:label="hasVille" rdfs:comment="Pour un etat sa liste de ville ">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="${req.headers.host}/rdf_vocabulary#Ville" />\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`

      // relation Etat vers ces literaux
      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasName" rdfs:label="hasName" rdfs:comment="Le nom de l’état">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="${req.headers.host}/rdf_vocabulary#Ville" />\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`

      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasNegative" rdfs:label="hasNegative" rdfs:comment="Le nombre de cas négatif au covid 19 pour l’état">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`

      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasPositive" rdfs:label="hasPositive" rdfs:comment="Le nombre de cas positif au covid 19pour l’état">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`

      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasDeath" rdfs:label="hasDeath" rdfs:comment="Le nombre de morts dû au covid 19 pour l’état">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`
    
      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hastotalTestResultSource" rdfs:label="hastotalTestResultSource" rdfs:comment="Le nombre de test au covid 19 pour l’état">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`

      xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hashospitalized" rdfs:label="hashospitalized" rdfs:comment="Le nombre d’hospitalisation du au covid 19 pour l’état">\n`
      xmlrdf += `\t\t<rdfs:domain rdf:resource="#Etat" />\n`
      xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
      xmlrdf += `\t</rdf:Property>\n`
      xmlrdf += `\n`


    // relation Ville vers Zone Urbaine 
  
    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasZoneUrbaine" rdfs:label="hasZoneUrbaine" rdfs:comment="Pour une ville sa zone urbaine ">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#Ville" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    // relation Ville vers ces literaux 

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasName" rdfs:label="hasName" rdfs:comment="Le nom de la ville">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#Ville" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasPopulation" rdfs:label="hasPopulation" rdfs:comment="La population de la ville">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#Ville" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    // relation Zone Urbaine vers ces literaux
    
    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasHousing" rdfs:label="hasHousing" rdfs:comment="Capacité d’hebergement de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasCostofLiving" rdfs:label="hasCostofLiving" rdfs:comment="Cout de la vie dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasStartups" rdfs:label="hasStartups" rdfs:comment="Nombre de startups de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasVentureCapital" rdfs:label="hasVentureCapital" rdfs:comment="Le capital-risque de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasTravelConnectivity" rdfs:label="hasTravelConnectivity" rdfs:comment="Capacité à voyager dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasCommute" rdfs:label="hasCommute" rdfs:comment="Les transport en commmuns de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasBusinessFreedom" rdfs:label="hasBusinessFreedom" rdfs:comment="La liberté des affaires dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasSafety" rdfs:label="hasSafety" rdfs:comment="La sécurité dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`


    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasHealthcare" rdfs:label="hasHealthcare" rdfs:comment="Indicateur de santé de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasEducation" rdfs:label="hasEducation" rdfs:comment="La Qualité de l’éducation de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasEnvironmentalQuality" rdfs:label="hasEnvironmentalQuality" rdfs:comment="La qualité de l’environnement dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasEconomy" rdfs:label="hasEconomy" rdfs:comment="La situation économique de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasTaxation" rdfs:label="hasTaxation" rdfs:comment="Le montant des impôts dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasInternetAccess" rdfs:label="hasInternetAccess" rdfs:comment="L’accès à Internet dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasLeisureCulture" rdfs:label="hasLeisureCulture" rdfs:comment="L’accès à la culture dans la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasTolerance" rdfs:label="hasTolerance" rdfs:comment="L’ouverture d’esprit de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `\t<rdf:Property rdf:about="${req.headers.host}/rdf_vocabulary#hasOutdoors" rdfs:label="hasOutdoors" rdfs:comment="Les activités à l’extérieur de la zone urbaine (note sur 10)">\n`
    xmlrdf += `\t\t<rdfs:domain rdf:resource="#ZoneUrbaine" />\n`
    xmlrdf += `\t\t<rdfs:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
    xmlrdf += `\t\t<rdfs:isDefinedBy rdf:resource="${req.headers.host}/rdf_vocabulary" />\n`
    xmlrdf += `\t</rdf:Property>\n`
    xmlrdf += `\n`

    xmlrdf += `</rdf:RDF>`
    res.send(xmlrdf)

    }
  })
})


app.get(/^.*?(?:\.([^\.\/]+))?$/, function(req, res) {
  req.negotiate(req.params[0], {
        "json;q=0.9": function() {
          res.send({ error: 404, message: `Not Found` }, 404);
      }
      , "html;q=1.1,default": function() {
          res.statusCode = 404;
          res.sendFile(__dirname + "/public/index.html")
          alert("Error 404, Not Found")
      }
  });
});

app.listen(port, function () {
    console.log(`Serveur listening on port ` + port);

});
