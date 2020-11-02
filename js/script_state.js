var display_state = function display_state(json){
  for(var element in json['_links']['city:items']){
    console.log(element, json['_links']['city:items'][element]['name']);
  }
}

module.exports = {display_state};
