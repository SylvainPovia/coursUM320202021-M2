function get_state_list(){
    let url = "https://api.teleport.org/api/countries/iso_alpha2:US/admin1_divisions/";
    fetch(url)
    .then(res => res.json())
    .then(json => {
      // console.log('fetch', json._links["a1:items"]);
      temp = json._links["a1:items"]
      liste = {}
      for (i=0; i<json.count;i++) {
          liste["item" + i] =  {"id":(temp[i].href.slice(-3).replace("/", "")),
                                "name":temp[i].name}
      }
      state_liste = liste
      return state_liste
    })
}
let state_liste; state_liste = get_state_list();
