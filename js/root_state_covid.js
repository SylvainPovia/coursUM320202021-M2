var root_state_covid = async function root_state_covid(state){
  let states = state_list.states_table.states_table
  var get_state_id = function get_state_id(name){

    filtered = states.filter(function(item){
        return item.name.toLowerCase() == name.toLowerCase();
    });

    return filtered['0']['id'];
}

  state_id = get_state_id(state);
  var info_state = {};
  // Données covid
  let url_covid = "https://api.covidtracking.com/v1/states/current.json";
  let get_covid_info = await fetch(url_covid);
  let get_json_covid_info = await get_covid_info.json()

  // Données démographique
  let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state_id+"/cities/";
  let get_name_ville = await fetch(url);
  let get_json_ville=  await get_name_ville.json()

  info_state[state_id] = {}
  temp = get_json_covid_info.filter(function(item){return item.state == state_id;})[0]
  info_state[state_id] = {"state":state, "date":temp["date"], "death":temp["death"], 
                            "positive":temp["positive"], "totalTestResultsSource":temp["positive"],
                            "hospitalizedCurrently":temp["hospitalizedCurrently"]}
  info_state[state_id]['cities'] = []
  console.log(get_json_ville['_links']['city:items'])
  // Boucle cities
  for(var element of get_json_ville['_links']['city:items']){
    //let full_name = element.name
    info_state[state_id]['cities'].push(element.name)
    continue
  }

  console.log("fini")
  return info_state;
}



var fetch = require('node-fetch');
var state_id = require('./state_id.js');
var state_list = require('./data.js')
module.exports = {root_state_covid};
