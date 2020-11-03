/*var display_state = function* display_state(json){
  for(var element in json['_links']['city:items']){
    console.log(element, json['_links']['city:items'][element]['name']);
    yield json['_links']['city:items'][element]['name'];
  }
}*/

/*
var id_ville = function* id_ville(json){
	

      	return json["_embedded"]["city:search-results"][0]['_links']["city:item"]["href"]


     

} 
*/
/*
var fetch_id = async function fetch_id(json){

	  var ville_info = {};
      for (let ville of display_state(json)) {
        console.log("ville",ville) ;
            let url = "https://api.teleport.org/api/cities/?search="+ville;
            let get_id = await  fetch(url);
            let get_json=  await get_id.json()
            let url_id = get_json["_embedded"]["city:search-results"][0]['_links']["city:item"]["href"]
            console.log(url_id)
            //let tmp =  id_ville(get_json);
            ville_info[ville] =  url_id;
            console.log(ville_info[ville])
            }
            return ville_info;
}*/


var init = async function init(){

let states = state_list.states_table.states_table

for (let state of states ) {

	let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state.id+"/cities/";
	
	let get_name_ville = await  fetch(url);
	let get_json_ville=  await get_name_ville.json()
	for(var element of get_json_ville['_links']['city:items']){
    console.log(element, get_json_ville['_links']['city:items'][element]);
    let url_id = element.href;
   
    let info_ville = await fetch(url_id)
    let get_json_info_ville =  await info_ville.json()
    let population = get_json_info_ville["population"]
    console.log(population)
  }





    let url_id = get_json["_embedded"]["city:search-results"][0]['_links']["city:item"]["href"]
    

}

}

var fetch = require('node-fetch');
var state_list = require('./data.js')
module.exports = {init};