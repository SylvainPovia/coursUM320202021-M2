var root_state_covid = async function root_state_covid(state_id){
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
  info_state[state_id] = get_json_covid_info.filter(function(item){return item.state == state_id;})[0]
  info_state[state_id]['cities'] = {}

  // Boucle cities
  for(var element of get_json_ville['_links']['city:items']){
    //let full_name = element.name
    info_state[state_id]['cities'][element.name] = {}
    let url_id = element.href;
    let get_info_ville = await fetch(url_id)
    let get_json_info_ville =  await get_info_ville.json()
    let population = get_json_info_ville["population"]


    if("city:urban_area" in get_json_info_ville["_links"]){
      let url_urban_aera = get_json_info_ville["_links"]["city:urban_area"]["href"] +"scores"
      //console.log(url_urban_aera)
      let get_info_ville_full = await fetch(url_urban_aera)
      let get_json_info_ville_full =  await get_info_ville_full.json()
      let stats_ville =  get_json_info_ville_full["categories"]

      //console.log("name :", stats_ville[var_info].name)
      for (var var_info in stats_ville) {
        name = stats_ville[var_info].name
        info_state[state_id]['cities'][element.name][name] = stats_ville[var_info].score_out_of_10
      }

      info_state[state_id]['cities'][element.name]["prefixe"] = state_id
      info_state[state_id]['cities'][element.name]["population"] = population
    }

    // Sinon
    info_state[state_id]['cities'][element.name]["prefixe"] = state_id
    info_state[state_id]['cities'][element.name]["population"] = population
    continue
  }

  console.log("fini")
  return info_state;
}



var fetch = require('node-fetch');
var state_id = require('./state_id.js');
var state_list = require('./data.js')
module.exports = {root_state_covid};
