var init = async function init(ville, etat){
  var info_villes = {};
  let states = state_list.states_table.states_table

  var get_state_id = function get_state_id(name){
    filtered = states.filter(function(item){
        return item.name.toLowerCase() == name.toLowerCase();;
    });
    return filtered['0']['id'];
}

  state_id = get_state_id(etat)

  // Données covid
  let url_covid = "https://api.covidtracking.com/v1/states/current.json";
  let get_covid_info = await fetch(url_covid);
  let get_json_covid_info = await get_covid_info.json()


    // Données démographique
  let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state_id+"/cities/";
  let get_name_ville = await fetch(url);
  let get_json_ville =  await get_name_ville.json()

  // boucle city
  get_json_ville = get_json_ville['_links']['city:items'];
  filtered = get_json_ville.filter(function(item){return item.name.toLowerCase() == ville.toLowerCase();})['0'];
  let url_id = filtered.href;
  let full_name = filtered.name
    // console.log("ville :" , full_name)
  let get_info_ville = await fetch(url_id)
  let get_json_info_ville =  await get_info_ville.json()
  let population = get_json_info_ville["population"]
  info_villes[full_name] = {}
  temp = get_json_covid_info.filter(function(item){return item.state == state_id;})[0]
  info_villes[full_name] = {"state":temp["state"], "date":temp["date"], "death":temp["death"], 
                            "positive":temp["positive"], "totalTestResultsSource":temp["positive"],
                            "hospitalizedCurrently":temp["hospitalizedCurrently"]}
  
  
  if("city:urban_area" in get_json_info_ville["_links"]){
    let url_urban_aera = get_json_info_ville["_links"]["city:urban_area"]["href"] +"scores"
    //console.log(url_urban_aera)
    let get_info_ville_full = await fetch(url_urban_aera)
    let get_json_info_ville_full =  await get_info_ville_full.json()
    let stats_ville =  get_json_info_ville_full["categories"]

    for (var var_info in stats_ville) {
      name = stats_ville[var_info].name
      info_villes[full_name][name] = stats_ville[var_info].score_out_of_10
    }

    info_villes[full_name]["prefixe"] = state_id
    info_villes[full_name]["population"] = population

    }

      info_villes[full_name]["prefixe"] = state_id;
      info_villes[full_name]["population"] = population;

  console.log("fini")
  return info_villes

}

var fetch = require('node-fetch');
var state_list = require('./data.js')
module.exports = {init};
